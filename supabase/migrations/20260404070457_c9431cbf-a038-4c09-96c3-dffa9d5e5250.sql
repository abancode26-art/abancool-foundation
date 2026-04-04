
CREATE OR REPLACE FUNCTION public.sql_mpesa_initiate(
    user_uuid uuid,
    invoice_id_input text,
    phone_number_input text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    invoice_record RECORD;
    payment_record RECORD;
    existing_payment_record RECORD;
    clean_phone TEXT;
    merchant_ref TEXT;
    api_response JSON;
    api_status INTEGER;
    result JSON;
    intasend_url TEXT := 'https://api.intasend.com/api/v1/payment/mpesa-stk-push/';
    intasend_secret TEXT := 'ISSecretKey_live_a23fadf2-34ff-4538-8383-8b7364a69e4c';
    intasend_public TEXT := 'ISPubKey_live_893ae672-1b3e-4c11-bb4a-d174d194ed63';
    callback_url TEXT;
BEGIN
    -- Clean phone: remove spaces, remove leading +, convert leading 0 to 254
    clean_phone := regexp_replace(phone_number_input, '\s+', '', 'g');
    clean_phone := regexp_replace(clean_phone, '^\+', '');
    clean_phone := regexp_replace(clean_phone, '^0', '254');

    IF clean_phone !~ '^254[0-9]{9}$' THEN
        RETURN json_build_object('success', false, 'error', 'Invalid phone number. Use format 254XXXXXXXXX');
    END IF;

    SELECT * INTO invoice_record
    FROM invoices
    WHERE id = invoice_id_input::uuid AND user_id = user_uuid AND status IN ('unpaid', 'pending');

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invoice not found or already paid');
    END IF;

    SELECT * INTO existing_payment_record
    FROM payments
    WHERE invoice_id = invoice_id_input::uuid AND status IN ('initiated'::payment_status, 'pending'::payment_status)
    LIMIT 1;

    IF FOUND THEN
        RETURN json_build_object('success', false, 'error', 'A payment is already in progress for this invoice', 'payment_id', existing_payment_record.id);
    END IF;

    merchant_ref := 'ABAN-' || COALESCE(invoice_record.invoice_number, invoice_record.id::text) || '-' || EXTRACT(EPOCH FROM NOW())::bigint;

    INSERT INTO payments (
        user_id, invoice_id, gateway, method, amount, currency, status, phone_number, merchant_reference, created_at, updated_at
    ) VALUES (
        user_uuid, invoice_id_input::uuid, 'intasend_mpesa', 'mpesa_stk_push',
        invoice_record.balance_due, invoice_record.currency, 'initiated'::payment_status,
        clean_phone, merchant_ref, NOW(), NOW()
    ) RETURNING * INTO payment_record;

    BEGIN
        callback_url := 'https://xastnibkihtrawlobhxa.supabase.co/functions/v1/mpesa-webhook';

        SELECT
            status,
            content::json
        INTO
            api_status,
            api_response
        FROM http((
            'POST',
            intasend_url,
            ARRAY[
                http_header('Content-Type', 'application/json'),
                http_header('Authorization', 'Bearer ' || intasend_secret)
            ],
            'application/json',
            json_build_object(
                'amount', invoice_record.balance_due,
                'phone_number', clean_phone,
                'api_ref', merchant_ref,
                'wallet_id', NULL
            )::text
        ));

        UPDATE payments
        SET
            status = CASE
                WHEN api_status = 200 OR api_status = 201 THEN 'pending'::payment_status
                ELSE 'failed'::payment_status
            END,
            checkout_request_id = COALESCE(
                api_response->>'id',
                api_response->>'checkout_id',
                api_response->>'invoice_id',
                api_response->>'reference'
            ),
            raw_request_json = json_build_object(
                'url', intasend_url,
                'amount', invoice_record.balance_due,
                'phone_number', clean_phone,
                'api_ref', merchant_ref
            ),
            raw_response_json = api_response,
            updated_at = NOW()
        WHERE id = payment_record.id;

        IF api_status = 200 OR api_status = 201 THEN
            UPDATE invoices SET status = 'pending', updated_at = NOW() WHERE id = invoice_id_input::uuid;
        END IF;

        BEGIN
            INSERT INTO notifications (user_id, title, message, type, action_url, created_at)
            VALUES (
                user_uuid,
                CASE WHEN api_status = 200 OR api_status = 201 THEN 'Payment Initiated' ELSE 'Payment Failed' END,
                CASE WHEN api_status = 200 OR api_status = 201 THEN
                    'M-Pesa STK Push sent for invoice ' || COALESCE(invoice_record.invoice_number, invoice_record.id::text) || '. Check your phone.'
                ELSE
                    'Payment initiation failed for invoice ' || COALESCE(invoice_record.invoice_number, invoice_record.id::text) || '. Please try again.'
                END,
                'payment',
                '/client/invoices/' || invoice_id_input,
                NOW()
            );
        EXCEPTION WHEN OTHERS THEN NULL;
        END;

        IF api_status = 200 OR api_status = 201 THEN
            result := json_build_object(
                'success', true,
                'payment_id', payment_record.id,
                'checkout_request_id', COALESCE(api_response->>'id', api_response->>'checkout_id', api_response->>'reference'),
                'message', 'STK Push sent to your phone. Please enter your M-Pesa PIN.',
                'api_response', api_response
            );
        ELSE
            result := json_build_object(
                'success', false,
                'error', 'STK Push failed: ' || COALESCE(api_response->'errors'->0->>'detail', api_response->>'message', api_response->>'detail', 'Unknown error'),
                'api_status', api_status,
                'api_response', api_response
            );
        END IF;

    EXCEPTION WHEN OTHERS THEN
        UPDATE payments
        SET status = 'failed'::payment_status,
            raw_response_json = json_build_object('error', 'API call failed: ' || SQLERRM),
            updated_at = NOW()
        WHERE id = payment_record.id;

        result := json_build_object('success', false, 'error', 'Payment API call failed: ' || SQLERRM);
    END;

    RETURN result;

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', 'Payment initiation failed: ' || SQLERRM);
END;
$$;
