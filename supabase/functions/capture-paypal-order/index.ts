import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface ShippingInfo {
  type: string;
  label: string;
  price: number;
}

interface ShippingAddress {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_1?: string;
  admin_area_2?: string;
  city?: string;
  country_code?: string;
  postal_code?: string;
}

interface PayerDetails {
  email_address?: string;
  payer_id?: string;
  name?: {
    given_name?: string;
    surname?: string;
  };
}

interface RequestBody {
  orderId: string;
  payerDetails?: PayerDetails;
  items: OrderItem[];
  shipping?: ShippingInfo;
  totalAmount: number;
  shippingAddress?: ShippingAddress;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let body: RequestBody;
    
    try {
      const text = await req.text();
      console.log("Capture request received");
      
      if (!text || text.trim() === "") {
        throw new Error("Corps de requête vide");
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

    const { orderId, payerDetails, items, shipping, totalAmount, shippingAddress } = body;

    // Validate required fields
    if (!orderId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Order ID manquant" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Articles manquants" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get Supabase credentials
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnon) {
      console.error("Missing Supabase configuration");
      throw new Error("Configuration serveur manquante");
    }

    // Create Supabase client with service role for DB operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get the authenticated user from the request
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader?.startsWith("Bearer ")) {
      try {
        // Create a client with the user's token to verify auth
        const userClient = createClient(supabaseUrl, supabaseAnon, {
          global: { headers: { Authorization: authHeader } }
        });
        
        const { data: { user }, error: userError } = await userClient.auth.getUser();
        
        if (!userError && user?.id) {
          userId = user.id;
          console.log("Authenticated user:", userId);
        } else {
          console.log("User auth failed:", userError?.message);
        }
      } catch (authError) {
        console.error("Auth error:", authError);
      }
    }

    // User must be authenticated
    if (!userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Authentification requise" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Build order data (GDPR compliant - minimal data)
    const orderData = {
      paypal_order_id: orderId,
      status: "paid", // Order is paid, not yet processed
      total_amount: totalAmount,
      currency: "EUR",
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      user_id: userId,
      // Store shipping method and address
      shipping_address: {
        method: shipping ? {
          type: shipping.type,
          label: shipping.label,
          price: shipping.price,
        } : null,
        address: shippingAddress ? {
          city: shippingAddress.city || shippingAddress.admin_area_2,
          country_code: shippingAddress.country_code,
          postal_code: shippingAddress.postal_code,
        } : null,
      },
      // Store minimal payer info (RGPD)
      payer_email: payerDetails?.email_address || null,
    };

    console.log("Inserting order:", orderId, "for user:", userId);

    // Store order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("Database error:", orderError);
      // Log but don't fail - payment was already successful
      // The order can be reconciled later from PayPal records
    } else {
      console.log("Order stored successfully:", order.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        dbOrderId: order?.id,
        message: "Commande enregistrée avec succès",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Capture error:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de l'enregistrement";
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
