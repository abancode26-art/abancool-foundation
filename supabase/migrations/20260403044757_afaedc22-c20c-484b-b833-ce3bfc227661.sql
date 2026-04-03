
-- Fix 1: Update the trigger function to use 'method' instead of 'payment_method'
CREATE OR REPLACE FUNCTION public.notify_payment_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    invoice_record invoices%ROWTYPE;
    user_record profiles%ROWTYPE;
    notification_title TEXT;
    notification_message TEXT;
    notification_type TEXT;
BEGIN
    IF NEW.status IN ('success', 'failed') AND OLD.status != NEW.status THEN
        SELECT * INTO invoice_record FROM invoices WHERE id = NEW.invoice_id;
        SELECT * INTO user_record FROM profiles WHERE id = NEW.user_id;
        
        IF NEW.status = 'success' THEN
            notification_title := 'Payment Successful';
            notification_message := 'Your payment of KES ' || NEW.amount || ' has been processed successfully. Your service will be activated shortly.';
            notification_type := 'success';
        ELSE
            notification_title := 'Payment Failed';
            notification_message := 'Your payment of KES ' || NEW.amount || ' could not be processed. Please try again or contact support.';
            notification_type := 'error';
        END IF;
        
        PERFORM create_notification(
            NEW.user_id,
            notification_title,
            notification_message,
            notification_type,
            '/client/invoices/' || invoice_record.id,
            jsonb_build_object(
                'payment_id', NEW.id,
                'invoice_id', NEW.invoice_id,
                'amount', NEW.amount,
                'currency', NEW.currency,
                'method', NEW.method
            )
        );
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Fix 2: Update sql_checkout to calculate 16% VAT
CREATE OR REPLACE FUNCTION public.sql_checkout(user_uuid uuid, coupon_code_input text DEFAULT NULL)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    cart_item RECORD;
    order_record RECORD;
    invoice_record RECORD;
    subtotal_amount DECIMAL(10,2) := 0;
    discount_amount DECIMAL(10,2) := 0;
    tax_amount DECIMAL(10,2) := 0;
    total_amount DECIMAL(10,2) := 0;
    coupon_id_var UUID := NULL;
    unit_price DECIMAL(10,2);
    item_description TEXT;
    product_name TEXT;
    billing_cycle_text TEXT;
    result JSON;
BEGIN
    -- Check if user has cart items
    IF NOT EXISTS (SELECT 1 FROM cart_items WHERE user_id = user_uuid) THEN
        RETURN json_build_object('success', false, 'error', 'Cart is empty');
    END IF;

    -- Calculate totals from cart
    FOR cart_item IN 
        SELECT * FROM cart_items WHERE user_id = user_uuid
    LOOP
        unit_price := 0;
        item_description := 'Product';
        product_name := 'Unknown Product';
        billing_cycle_text := COALESCE(cart_item.billing_cycle::TEXT, 'monthly');

        IF cart_item.item_type = 'hosting' OR cart_item.item_type = 'hosting_package' THEN
            SELECT price + COALESCE(setup_fee, 0) INTO unit_price
            FROM hosting_product_pricing 
            WHERE product_id = cart_item.product_id 
            AND billing_cycle::TEXT = billing_cycle_text
            AND is_active = true
            LIMIT 1;

            IF unit_price IS NULL OR unit_price = 0 THEN
                SELECT 
                    CASE 
                        WHEN billing_cycle_text IN ('annually', 'annual') THEN COALESCE(annual_price, 0)
                        ELSE COALESCE(monthly_price, 0)
                    END + COALESCE(setup_fee, 0)
                INTO unit_price
                FROM hosting_packages 
                WHERE id = cart_item.product_id;
            END IF;

            SELECT name INTO product_name FROM hosting_products WHERE id = cart_item.product_id;
            IF product_name IS NULL THEN
                SELECT name INTO product_name FROM hosting_packages WHERE id = cart_item.product_id;
            END IF;

            item_description := COALESCE(product_name, 'Hosting') || ' - ' || billing_cycle_text;
            IF cart_item.domain_name IS NOT NULL THEN
                item_description := item_description || ' (' || cart_item.domain_name || ')';
            END IF;
        END IF;

        -- Domain items
        IF cart_item.item_type IN ('domain_register', 'domain_transfer', 'domain_renew') THEN
            SELECT register_price INTO unit_price
            FROM domain_tlds 
            WHERE tld = cart_item.tld AND is_active = true
            LIMIT 1;
            
            IF cart_item.item_type = 'domain_transfer' THEN
                SELECT transfer_price INTO unit_price FROM domain_tlds WHERE tld = cart_item.tld AND is_active = true LIMIT 1;
            ELSIF cart_item.item_type = 'domain_renew' THEN
                SELECT renew_price INTO unit_price FROM domain_tlds WHERE tld = cart_item.tld AND is_active = true LIMIT 1;
            END IF;

            item_description := cart_item.item_type || ': ' || COALESCE(cart_item.domain_name, '') || COALESCE(cart_item.tld, '');
        END IF;

        subtotal_amount := subtotal_amount + (COALESCE(unit_price, 0) * COALESCE(cart_item.quantity, 1));
    END LOOP;

    -- Apply coupon if provided
    IF coupon_code_input IS NOT NULL THEN
        SELECT id INTO coupon_id_var
        FROM coupons 
        WHERE UPPER(code) = UPPER(coupon_code_input) 
        AND is_active = true
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (expires_at IS NULL OR expires_at >= NOW())
        AND (max_uses IS NULL OR used_count < max_uses)
        LIMIT 1;

        IF coupon_id_var IS NOT NULL THEN
            SELECT 
                CASE 
                    WHEN discount_type = 'percent' THEN subtotal_amount * (discount_value / 100)
                    ELSE discount_value
                END
            INTO discount_amount
            FROM coupons 
            WHERE id = coupon_id_var;
            
            discount_amount := LEAST(COALESCE(discount_amount, 0), subtotal_amount);
        END IF;
    END IF;

    -- Calculate 16% VAT on discounted subtotal
    tax_amount := ROUND((subtotal_amount - discount_amount) * 0.16, 2);
    total_amount := subtotal_amount - discount_amount + tax_amount;

    -- Create order
    INSERT INTO orders (
        user_id, status, subtotal, tax, total, currency, coupon_id, created_at, updated_at
    ) VALUES (
        user_uuid, 'pending_payment', subtotal_amount - discount_amount, tax_amount, total_amount, 'KES', coupon_id_var, NOW(), NOW()
    ) RETURNING * INTO order_record;

    -- Create order items
    FOR cart_item IN 
        SELECT * FROM cart_items WHERE user_id = user_uuid
    LOOP
        unit_price := 0;
        item_description := 'Product';
        product_name := 'Unknown Product';
        billing_cycle_text := COALESCE(cart_item.billing_cycle::TEXT, 'monthly');

        IF cart_item.item_type = 'hosting' OR cart_item.item_type = 'hosting_package' THEN
            SELECT price + COALESCE(setup_fee, 0) INTO unit_price
            FROM hosting_product_pricing 
            WHERE product_id = cart_item.product_id 
            AND billing_cycle::TEXT = billing_cycle_text AND is_active = true LIMIT 1;

            IF unit_price IS NULL OR unit_price = 0 THEN
                SELECT CASE WHEN billing_cycle_text IN ('annually', 'annual') THEN COALESCE(annual_price, 0) ELSE COALESCE(monthly_price, 0) END + COALESCE(setup_fee, 0)
                INTO unit_price FROM hosting_packages WHERE id = cart_item.product_id;
            END IF;

            SELECT name INTO product_name FROM hosting_products WHERE id = cart_item.product_id;
            IF product_name IS NULL THEN
                SELECT name INTO product_name FROM hosting_packages WHERE id = cart_item.product_id;
            END IF;

            item_description := COALESCE(product_name, 'Hosting') || ' - ' || billing_cycle_text;
            IF cart_item.domain_name IS NOT NULL THEN
                item_description := item_description || ' (' || cart_item.domain_name || ')';
            END IF;
        END IF;

        IF cart_item.item_type IN ('domain_register', 'domain_transfer', 'domain_renew') THEN
            SELECT register_price INTO unit_price FROM domain_tlds WHERE tld = cart_item.tld AND is_active = true LIMIT 1;
            IF cart_item.item_type = 'domain_transfer' THEN
                SELECT transfer_price INTO unit_price FROM domain_tlds WHERE tld = cart_item.tld AND is_active = true LIMIT 1;
            ELSIF cart_item.item_type = 'domain_renew' THEN
                SELECT renew_price INTO unit_price FROM domain_tlds WHERE tld = cart_item.tld AND is_active = true LIMIT 1;
            END IF;
            item_description := cart_item.item_type || ': ' || COALESCE(cart_item.domain_name, '') || COALESCE(cart_item.tld, '');
        END IF;

        INSERT INTO order_items (
            order_id, product_id, item_type, description, qty, unit_price, total_price, domain_name, metadata_json
        ) VALUES (
            order_record.id, cart_item.product_id, cart_item.item_type, item_description, 
            COALESCE(cart_item.quantity, 1), COALESCE(unit_price, 0), COALESCE(unit_price, 0) * COALESCE(cart_item.quantity, 1),
            cart_item.domain_name, cart_item.metadata_json
        );
    END LOOP;

    -- Create invoice
    INSERT INTO invoices (
        user_id, order_id, subtotal, tax, total, balance_due, currency, status, created_at, updated_at
    ) VALUES (
        user_uuid, order_record.id, subtotal_amount - discount_amount, tax_amount, total_amount, total_amount, 'KES', 'unpaid', NOW(), NOW()
    ) RETURNING * INTO invoice_record;

    -- Create invoice items
    INSERT INTO invoice_items (invoice_id, description, qty, unit_price, total_price)
    SELECT invoice_record.id, oi.description, oi.qty, oi.unit_price, oi.total_price
    FROM order_items oi WHERE oi.order_id = order_record.id;

    -- Add VAT line item to invoice
    IF tax_amount > 0 THEN
        INSERT INTO invoice_items (invoice_id, description, qty, unit_price, total_price)
        VALUES (invoice_record.id, 'VAT (16%)', 1, tax_amount, tax_amount);
    END IF;

    -- Update coupon usage
    IF coupon_id_var IS NOT NULL THEN
        UPDATE coupons SET used_count = used_count + 1 WHERE id = coupon_id_var;
    END IF;

    -- Clear cart
    DELETE FROM cart_items WHERE user_id = user_uuid;

    -- Notify admin
    PERFORM create_notification(
        (SELECT id FROM profiles WHERE role IN ('super_admin', 'admin') LIMIT 1),
        'New Order: ' || order_record.order_number,
        'A new order has been placed for KES ' || total_amount,
        'order',
        '/admin/orders',
        jsonb_build_object('order_id', order_record.id, 'total', total_amount)
    );

    RETURN json_build_object(
        'success', true,
        'order_id', order_record.id,
        'order_number', order_record.order_number,
        'invoice_id', invoice_record.id,
        'invoice_number', invoice_record.invoice_number,
        'subtotal', subtotal_amount - discount_amount,
        'tax', tax_amount,
        'total', total_amount
    );
END;
$function$;
