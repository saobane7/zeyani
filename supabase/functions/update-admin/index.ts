import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

Deno.serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Delete the conflicting user with the target email
    const conflictingId = 'c241a474-453c-42e0-9485-c0cbcab94701'
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(conflictingId)
    if (delErr) {
      console.error('Delete err:', delErr)
    }

    // 2. Update the admin user with the new email and password
    const adminId = 'bd53e446-7069-4557-9386-4e8767a0041c'
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      adminId,
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
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
