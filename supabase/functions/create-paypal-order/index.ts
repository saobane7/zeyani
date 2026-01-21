import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  quantity: number;
  unit_amount: {
    value: string;
  };
}

interface RequestBody {
  items: OrderItem[];
  totalAmount: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body safely
    let body: RequestBody;
    
    try {
      const text = await req.text();
      console.log("Received request body:", text);
      
      if (!text || text.trim() === "") {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Corps de requête vide" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      body = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Format de données invalide" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { items, totalAmount } = body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items:", items);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Panier invalide ou vide" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate total amount
    if (!totalAmount || typeof totalAmount !== "number" || totalAmount <= 0) {
      console.error("Invalid total amount:", totalAmount);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Montant total invalide" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate each item structure
    for (const item of items) {
      if (!item.name || !item.quantity || !item.unit_amount?.value) {
        console.error("Invalid item structure:", item);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Structure d'article invalide" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
    }

    // Calculate expected total from items
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + (parseFloat(item.unit_amount.value) * item.quantity);
    }, 0);

    // Allow small rounding differences
    if (Math.abs(calculatedTotal - totalAmount) > 0.02) {
      console.error("Total mismatch:", { calculatedTotal, totalAmount });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Le montant total ne correspond pas aux articles" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Order validated successfully:", { items: items.length, totalAmount });

    // Build PayPal order data
    const orderData = {
      intent: "CAPTURE",
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
        items: items.map((item) => ({
          name: item.name.substring(0, 127),
          quantity: String(item.quantity),
          unit_amount: {
            currency_code: "EUR",
            value: parseFloat(item.unit_amount.value).toFixed(2),
          },
        })),
      }],
      application_context: {
        shipping_preference: "GET_FROM_FILE",
        user_action: "PAY_NOW",
        brand_name: "Niger Chic Designs",
        locale: "fr-FR",
      },
    };

    return new Response(
      JSON.stringify({
        success: true,
        orderData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
