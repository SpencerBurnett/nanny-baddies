import { supabase } from './supabase'

// Client-side helpers that call the Stripe edge functions.
// Activates once STRIPE_* secrets are set on the Supabase project and the
// tiers table holds real stripe_price_id values. Until then the edge function
// returns an error and callers fall back to a "coming soon" message.

export async function startCheckout(
  params: { tierSlug?: string; trial?: boolean },
): Promise<{ url?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: { tierSlug: params.tierSlug, trial: params.trial ?? false, origin: window.location.origin },
  })
  if (error) return { error: error.message }
  const res = data as { url?: string; error?: string }
  return { url: res?.url, error: res?.error }
}

export async function openBillingPortal(): Promise<{ url?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('stripe-portal', {
    body: { origin: window.location.origin },
  })
  if (error) return { error: error.message }
  const res = data as { url?: string; error?: string }
  return { url: res?.url, error: res?.error }
}
