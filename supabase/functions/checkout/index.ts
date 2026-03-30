import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const { coupon_code } = await req.json();

    // Get cart items
    const { data: cartItems, error: cartError } = await supabaseUser
      .from("cart_items")
      .select("*, hosting_products(name, slug, directadmin_package_name)")
      .eq("user_id", user.id);

    if (cartError) throw cartError;
    if (!cartItems?.length) return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400, headers: corsHeaders });

    // Calculate totals
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of cartItems) {
      let unitPrice = 0;
      let description = "";

      if (item.item_type === "hosting" && item.product_id) {
        const { data: pricing } = await supabaseAdmin
          .from("hosting_product_pricing")
          .select("price, setup_fee")
          .eq("product_id", item.product_id)
          .eq("billing_cycle", item.billing_cycle!)
          .eq("is_active", true)
          .single();

        unitPrice = pricing ? Number(pricing.price) + Number(pricing.setup_fee) : 0;
        description = `${item.hosting_products?.name || "Hosting"} - ${item.billing_cycle}`;
        if (item.domain_name) description += ` (${item.domain_name})`;
      } else if (["domain_register", "domain_transfer", "domain_renew"].includes(item.item_type)) {
        const { data: tld } = await supabaseAdmin
          .from("domain_tlds")
          .select("register_price, transfer_price, renew_price")
          .eq("tld", item.tld!)
          .single();

        if (tld) {
          if (item.item_type === "domain_register") unitPrice = Number(tld.register_price);
          else if (item.item_type === "domain_transfer") unitPrice = Number(tld.transfer_price);
          else unitPrice = Number(tld.renew_price);
        }
        description = `Domain ${item.item_type.replace("domain_", "")} - ${item.domain_name}`;
      }

      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItemsData.push({
        item_type: item.item_type,
        product_id: item.product_id,
        description,
        domain_name: item.domain_name,
        billing_cycle: item.billing_cycle,
        qty: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        metadata_json: item.metadata_json,
      });
    }

    // Apply coupon if provided
    let discount = 0;
    let couponId: string | null = null;
    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (coupon) {
        const now = new Date();
        const valid = (!coupon.starts_at || new Date(coupon.starts_at) <= now) &&
                      (!coupon.expires_at || new Date(coupon.expires_at) >= now) &&
                      (!coupon.max_uses || coupon.used_count < coupon.max_uses);
        if (valid) {
          couponId = coupon.id;
          discount = coupon.discount_type === "percent"
            ? subtotal * (Number(coupon.discount_value) / 100)
            : Number(coupon.discount_value);
          discount = Math.min(discount, subtotal);
        }
      }
    }

    const tax = 0; // Tax can be configured via admin_settings later
    const total = subtotal - discount + tax;

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending_payment",
        subtotal: subtotal - discount,
        tax,
        total,
        currency: "KES",
        coupon_id: couponId,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const itemsWithOrderId = orderItemsData.map(item => ({ ...item, order_id: order.id }));
    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(itemsWithOrderId);
    if (itemsError) throw itemsError;

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from("invoices")
      .insert({
        user_id: user.id,
        order_id: order.id,
        status: "unpaid",
        subtotal: subtotal - discount,
        tax,
        total,
        balance_due: total,
        currency: "KES",
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Create invoice items
    const invoiceItems = orderItemsData.map(item => ({
      invoice_id: invoice.id,
      description: item.description,
      qty: item.qty,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));
    await supabaseAdmin.from("invoice_items").insert(invoiceItems);

    // Increment coupon usage
    if (couponId) {
      await supabaseAdmin.rpc("increment_coupon_usage", { coupon_id: couponId }).catch(() => {
        // Non-critical, log but don't fail
        console.warn("Failed to increment coupon usage");
      });
    }

    // Clear cart
    await supabaseAdmin.from("cart_items").delete().eq("user_id", user.id);

    return new Response(JSON.stringify({
      order_id: order.id,
      order_number: order.order_number,
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      total,
      currency: "KES",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message || "Checkout failed" }), {
      status: 500, headers: corsHeaders,
    });
  }
});
