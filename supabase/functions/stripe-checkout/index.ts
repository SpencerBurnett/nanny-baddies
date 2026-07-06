// Creates a Stripe Checkout Session — quarterly subscription or one-time paid trial.
//
// Required secrets (set with `supabase secrets set`):
//   STRIPE_SECRET_KEY          — Stripe secret key (sk_live_… / sk_test_…)
//   STRIPE_TRIAL_PRICE_ID      — Price ID for the $2,000 one-time paid trial
//   SUPABASE_URL               — auto-provided
//   SUPABASE_SERVICE_ROLE_KEY  — auto-provided
//
// Subscription tiers read their Price ID from tiers.stripe_price_id.

import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { tierSlug, trial, origin } = await req.json()
    const success_url = `${origin}/login?welcome=1`
    const cancel_url = `${origin}/enroll`

    let session
    if (trial) {
      const price = Deno.env.get('STRIPE_TRIAL_PRICE_ID')
      if (!price) return json({ error: 'Trial price not configured' }, 400)
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price, quantity: 1 }],
        success_url,
        cancel_url,
        metadata: { kind: 'trial' },
      })
    } else {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )
      const { data: tier } = await supabase
        .from('tiers')
        .select('id, stripe_price_id')
        .eq('slug', tierSlug)
        .single()
      if (!tier?.stripe_price_id) return json({ error: 'Tier not configured' }, 400)
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: tier.stripe_price_id, quantity: 1 }],
        success_url,
        cancel_url,
        metadata: { kind: 'subscription', tier_id: tier.id, tier_slug: tierSlug },
      })
    }

    return json({ url: session.url })
  } catch (e) {
    return json({ error: String(e) }, 400)
  }
})
