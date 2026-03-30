import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { domain } = await req.json();
    if (!domain || typeof domain !== "string" || domain.length < 2) {
      return new Response(JSON.stringify({ error: "Valid domain name required" }), { status: 400, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Get active TLDs from database
    const { data: tlds } = await supabaseAdmin
      .from("domain_tlds")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (!tlds?.length) {
      return new Response(JSON.stringify({ results: [], message: "No TLDs configured" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Clean domain input
    const cleanDomain = domain.trim().toLowerCase().replace(/^www\./, "");
    const parts = cleanDomain.split(".");
    const sld = parts[0]; // Second-level domain

    const DOMAIN_API_BASE_URL = Deno.env.get("DOMAIN_API_BASE_URL");
    const DOMAIN_API_KEY = Deno.env.get("DOMAIN_API_KEY");
    const DOMAIN_API_SECRET = Deno.env.get("DOMAIN_API_SECRET");

    const results: any[] = [];

    if (DOMAIN_API_BASE_URL && DOMAIN_API_KEY) {
      // Real domain API check
      for (const tld of tlds) {
        const fullDomain = `${sld}${tld.tld}`;
        try {
          const checkResponse = await fetch(`${DOMAIN_API_BASE_URL}/domains/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${DOMAIN_API_KEY}`,
              ...(DOMAIN_API_SECRET ? { "X-Api-Secret": DOMAIN_API_SECRET } : {}),
            },
            body: JSON.stringify({ domain: fullDomain }),
          });

          const checkData = await checkResponse.json();
          results.push({
            domain: fullDomain,
            tld: tld.tld,
            available: checkData.available ?? checkData.status === "available",
            price: Number(tld.register_price),
            currency: "KES",
            premium: checkData.premium || false,
          });
        } catch (err) {
          // If API fails for one TLD, still show it with unknown availability
          results.push({
            domain: fullDomain,
            tld: tld.tld,
            available: null, // Unknown
            price: Number(tld.register_price),
            currency: "KES",
          });
        }
      }
    } else {
      // No domain API configured - return TLD pricing with simulated availability
      // In production, this should always use the real API
      for (const tld of tlds) {
        const fullDomain = `${sld}${tld.tld}`;
        results.push({
          domain: fullDomain,
          tld: tld.tld,
          available: null, // null = not checked (API not configured)
          price: Number(tld.register_price),
          currency: "KES",
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Domain search error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
