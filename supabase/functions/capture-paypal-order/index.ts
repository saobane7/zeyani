import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, payerDetails, items, shipping, totalAmount, shippingAddress } = await req.json();

    if (!orderId) {
      throw new Error("Order ID manquant");
    }

    // Create Supabase client with service role for DB operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get the authenticated user from the request
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader?.startsWith("Bearer ")) {
      // Create a client with the user's token to verify auth
      const userClient = createClient(supabaseUrl, supabaseAnon, {
        global: { headers: { Authorization: authHeader } }
      });
      
      const { data: { user }, error: userError } = await userClient.auth.getUser();
      
      if (!userError && user?.id) {
        userId = user.id;
        console.log("Authenticated user:", userId);
      }
    }

    // Store order in database (GDPR compliant - minimal data)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        paypal_order_id: orderId,
        status: "completed",
        total_amount: totalAmount,
        currency: "EUR",
        items: items,
        user_id: userId,
        // Store shipping method and address
        shipping_address: {
          method: shipping ? {
            type: shipping.type,
            label: shipping.label,
            price: shipping.price,
          } : null,
          address: shippingAddress ? {
            city: shippingAddress.city,
            country_code: shippingAddress.country_code,
            postal_code: shippingAddress.postal_code,
          } : null,
        },
        // Store minimal payer info (RGPD)
        payer_email: payerDetails?.email_address || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error("Database error:", orderError);
      // Don't fail the payment if DB storage fails
      // Just log it for manual review
    }

    console.log("Order captured successfully:", orderId, "User:", userId || "guest");

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        message: "Commande confirmée avec succès",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Capture error:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de la capture";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
