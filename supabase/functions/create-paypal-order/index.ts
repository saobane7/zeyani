import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Safely parse request body
    let body;
    try {
      const text = await req.text();
      if (!text || text.trim() === "") {
        throw new Error("Request body is empty");
      }
      body = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Invalid request body - JSON parsing failed");
    }

    const { items, totalAmount } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Items invalides");
    }

    if (!totalAmount || totalAmount <= 0) {
      throw new Error("Montant invalide");
    }

    // Validate items structure
    for (const item of items) {
      if (!item.name || !item.quantity || !item.unit_amount?.value) {
        throw new Error("Structure d'article invalide");
      }
    }

    // Return order data for PayPal Buttons (client-side creation)
    return new Response(
      JSON.stringify({
        success: true,
        orderData: {
          purchase_units: [{
            amount: {
              currency_code: "EUR",
              value: totalAmount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "EUR",
                  value: totalAmount.toFixed(2),
                },
              },
            },
            items: items.map((item: any) => ({
              name: item.name.substring(0, 127),
              quantity: String(item.quantity),
              unit_amount: {
                currency_code: "EUR",
                value: parseFloat(item.unit_amount.value).toFixed(2),
              },
            })),
          }],
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("PayPal order error:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de la création de la commande";
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
