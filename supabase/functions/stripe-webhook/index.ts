// Handles Stripe webhooks. On a completed checkout it provisions the customer:
// creates an auth user (if new), a profile, and — for subscriptions — a
// subscription record. The client sets their password via the invite email.
//
// Required secrets:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET      — from the Stripe webhook endpoint config
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (auto-provided)
//
// Point a Stripe webhook at this function for event: checkout.session.completed

import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})
const cryptoProvider = Stripe.createSubtleCryptoProvider()

const admin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature ?? '',
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '',
      undefined,
      cryptoProvider,
    )
  } catch (e) {
    return new Response(`Webhook signature verification failed: ${e}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email
    const kind = session.metadata?.kind ?? 'subscription'

    if (email) {
      // Provision (or reuse) the auth user + profile.
      let userId: string | null = null
      const { data: created, error } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
      })
      if (error) {
        // Likely already exists — look them up.
        const { data: existing } = await admin.from('profiles').select('id').eq('email', email).maybeSingle()
        userId = existing?.id ?? null
      } else {
        userId = created.user?.id ?? null
      }

      if (userId) {
        await admin.from('profiles').upsert({
          id: userId,
          role: 'client',
          email,
          first_name: session.customer_details?.name?.split(' ')[0] ?? 'New',
          last_name: session.customer_details?.name?.split(' ').slice(1).join(' ') || 'Client',
          status: kind === 'trial' ? 'lead' : 'enrolled',
        }, { onConflict: 'id' })

        if (kind === 'subscription') {
          await admin.from('subscriptions').insert({
            profile_id: userId,
            tier_id: session.metadata?.tier_id ?? null,
            stripe_customer_id: String(session.customer ?? ''),
            stripe_subscription_id: String(session.subscription ?? ''),
            status: 'active',
          })
        }
        // Send a password-set invite so they can log in.
        await admin.auth.admin.inviteUserByEmail(email)
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
