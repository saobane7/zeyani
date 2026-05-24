import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

Deno.serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      'bd53e446-7069-4557-9386-4e8767a0041c',
      {
        email: 'Zeyani-site@outlook.fr',
        password: 'zeyani1234',
        email_confirm: true,
      }
    )

    if (error) {
      console.error('Update user error:', error)
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Caught error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
