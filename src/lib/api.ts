import { supabase } from './supabase'
import type {
  Application,
  ApplicationType,
  Profile,
  ProfileStatus,
  ClientProfile,
  BaddieProfile,
  Tier,
  Subscription,
  ServiceCategory,
  ServiceItem,
  Checklist,
  ChecklistItem,
  Match,
  Shift,
  ShiftChecklistItem,
  ShiftStatus,
  Conversation,
  Message,
  Earning,
} from '../types'

// ─── Applications (public) ───────────────────────────────────────────

export async function submitApplication(
  type: ApplicationType,
  data: Record<string, unknown>
): Promise<{ id: string } | null> {
  const { data: row, error } = await supabase
    .from('applications')
    .insert({
      type,
      data,
      email: data.email as string,
      first_name: data.firstName as string,
      last_name: data.lastName as string,
      phone: (data.phone as string) || null,
    })
    .select('id')
    .single()
  if (error) {
    console.error('submitApplication:', error.message)
    return null
  }
  return row as { id: string }
}

export async function getApplications(
  filters?: { type?: ApplicationType; status?: string }
): Promise<Application[]> {
  let q = supabase.from('applications').select('*').order('created_at', { ascending: false })
  if (filters?.type) q = q.eq('type', filters.type)
  if (filters?.status) q = q.eq('status', filters.status)
  const { data } = await q
  return (data as Application[]) ?? []
}

export async function updateApplication(
  id: string,
  updates: { status?: string; notes?: string; reviewed_by?: string }
): Promise<boolean> {
  const { error } = await supabase
    .from('applications')
    .update({ ...updates, reviewed_at: new Date().toISOString() })
    .eq('id', id)
  return !error
}

// ─── Profiles ────────────────────────────────────────────────────────

export async function getProfile(id: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
  return data as Profile | null
}

export async function updateProfile(
  id: string,
  updates: Partial<Pick<Profile, 'first_name' | 'last_name' | 'phone' | 'avatar_url' | 'status'>>
): Promise<boolean> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id)
  return !error
}

export async function getProfiles(
  filters?: { role?: string; status?: ProfileStatus }
): Promise<Profile[]> {
  let q = supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (filters?.role) q = q.eq('role', filters.role)
  if (filters?.status) q = q.eq('status', filters.status)
  const { data } = await q
  return (data as Profile[]) ?? []
}

// ─── Client Profiles ─────────────────────────────────────────────────

export async function getClientProfile(profileId: string): Promise<ClientProfile | null> {
  const { data } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('profile_id', profileId)
    .single()
  return data as ClientProfile | null
}

export async function upsertClientProfile(
  profileId: string,
  fields: Partial<Omit<ClientProfile, 'id' | 'profile_id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('client_profiles')
    .upsert({ profile_id: profileId, ...fields }, { onConflict: 'profile_id' })
  return !error
}

// ─── Baddie Profiles ─────────────────────────────────────────────────

export async function getBaddieProfile(profileId: string): Promise<BaddieProfile | null> {
  const { data } = await supabase
    .from('baddie_profiles')
    .select('*')
    .eq('profile_id', profileId)
    .single()
  return data as BaddieProfile | null
}

export async function upsertBaddieProfile(
  profileId: string,
  fields: Partial<Omit<BaddieProfile, 'id' | 'profile_id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('baddie_profiles')
    .upsert({ profile_id: profileId, ...fields }, { onConflict: 'profile_id' })
  return !error
}

// ─── Tiers ───────────────────────────────────────────────────────────

export async function getTiers(): Promise<Tier[]> {
  const { data } = await supabase.from('tiers').select('*').order('shifts_per_week')
  return (data as Tier[]) ?? []
}

// ─── Subscriptions ───────────────────────────────────────────────────

export async function getSubscription(profileId: string): Promise<Subscription | null> {
  const { data } = await supabase
    .from('subscriptions')
    .select('*, tier:tiers(*)')
    .eq('profile_id', profileId)
    .single()
  return data as Subscription | null
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const { data } = await supabase
    .from('subscriptions')
    .select('*, tier:tiers(*)')
    .order('created_at', { ascending: false })
  return (data as Subscription[]) ?? []
}

// ─── Service Catalog ─────────────────────────────────────────────────

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const { data } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order')
  return (data as ServiceCategory[]) ?? []
}

export async function getServiceItems(categoryId?: string): Promise<ServiceItem[]> {
  let q = supabase.from('service_items').select('*').order('sort_order')
  if (categoryId) q = q.eq('category_id', categoryId)
  const { data } = await q
  return (data as ServiceItem[]) ?? []
}

// ─── Checklists ──────────────────────────────────────────────────────

export async function getActiveChecklist(clientId: string): Promise<Checklist | null> {
  const { data } = await supabase
    .from('checklists')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .single()
  return data as Checklist | null
}

export async function getChecklistItems(checklistId: string): Promise<ChecklistItem[]> {
  const { data } = await supabase
    .from('checklist_items')
    .select('*, service_item:service_items(*)')
    .eq('checklist_id', checklistId)
    .order('sort_order')
  return (data as ChecklistItem[]) ?? []
}

export async function saveChecklist(
  clientId: string,
  items: { service_item_id: string; custom_note?: string; enabled?: boolean }[]
): Promise<string | null> {
  const existing = await getActiveChecklist(clientId)
  if (existing) {
    await supabase
      .from('checklists')
      .update({ is_active: false })
      .eq('id', existing.id)
  }

  const { data: checklist, error } = await supabase
    .from('checklists')
    .insert({
      client_id: clientId,
      version: (existing?.version ?? 0) + 1,
      is_active: true,
    })
    .select('id')
    .single()

  if (error || !checklist) return null

  const rows = items.map((item, i) => ({
    checklist_id: (checklist as { id: string }).id,
    service_item_id: item.service_item_id,
    custom_note: item.custom_note ?? null,
    enabled: item.enabled ?? true,
    sort_order: i,
  }))

  await supabase.from('checklist_items').insert(rows)
  return (checklist as { id: string }).id
}

// ─── Matches ─────────────────────────────────────────────────────────

export async function getMatches(
  filters?: { client_id?: string; baddie_id?: string; status?: string }
): Promise<Match[]> {
  let q = supabase
    .from('matches')
    .select('*, client:profiles!matches_client_id_fkey(*), baddie:profiles!matches_baddie_id_fkey(*)')
    .order('created_at', { ascending: false })
  if (filters?.client_id) q = q.eq('client_id', filters.client_id)
  if (filters?.baddie_id) q = q.eq('baddie_id', filters.baddie_id)
  if (filters?.status) q = q.eq('status', filters.status)
  const { data } = await q
  return (data as Match[]) ?? []
}

export async function createMatch(
  clientId: string,
  baddieId: string,
  matchedBy: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('matches')
    .insert({ client_id: clientId, baddie_id: baddieId, matched_by: matchedBy })
    .select('id')
    .single()
  if (error) return null
  return (data as { id: string }).id
}

export async function updateMatch(
  id: string,
  updates: Partial<Pick<Match, 'status' | 'notes' | 'ended_at'>>
): Promise<boolean> {
  const { error } = await supabase.from('matches').update(updates).eq('id', id)
  return !error
}

// ─── Shifts ──────────────────────────────────────────────────────────

export async function getShifts(
  filters?: { client_id?: string; baddie_id?: string; status?: ShiftStatus; from?: string; to?: string }
): Promise<Shift[]> {
  let q = supabase
    .from('shifts')
    .select('*, client:profiles!shifts_client_id_fkey(*), baddie:profiles!shifts_baddie_id_fkey(*)')
    .order('scheduled_date')
    .order('start_time')
  if (filters?.client_id) q = q.eq('client_id', filters.client_id)
  if (filters?.baddie_id) q = q.eq('baddie_id', filters.baddie_id)
  if (filters?.status) q = q.eq('status', filters.status)
  if (filters?.from) q = q.gte('scheduled_date', filters.from)
  if (filters?.to) q = q.lte('scheduled_date', filters.to)
  const { data } = await q
  return (data as Shift[]) ?? []
}

export async function createShift(shift: {
  match_id: string
  client_id: string
  baddie_id: string
  scheduled_date: string
  start_time: string
  end_time: string
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('shifts')
    .insert(shift)
    .select('id')
    .single()
  if (error) return null
  return (data as { id: string }).id
}

export async function updateShift(
  id: string,
  updates: Partial<Pick<Shift, 'status' | 'cancel_reason' | 'started_at' | 'completed_at' | 'baddie_notes' | 'client_rating'>>
): Promise<boolean> {
  const { error } = await supabase.from('shifts').update(updates).eq('id', id)
  return !error
}

export async function getShiftChecklist(shiftId: string): Promise<ShiftChecklistItem[]> {
  const { data } = await supabase
    .from('shift_checklist_items')
    .select('*, checklist_item:checklist_items(*, service_item:service_items(*))')
    .eq('shift_id', shiftId)
  return (data as ShiftChecklistItem[]) ?? []
}

export async function updateShiftChecklistItem(
  id: string,
  updates: { completed?: boolean; completed_at?: string; note?: string; photo_url?: string }
): Promise<boolean> {
  const { error } = await supabase.from('shift_checklist_items').update(updates).eq('id', id)
  return !error
}

// ─── Conversations & Messages ────────────────────────────────────────

export async function getConversations(profileId: string): Promise<Conversation[]> {
  const { data } = await supabase
    .from('conversations')
    .select('*')
    .or(`client_id.eq.${profileId},baddie_id.eq.${profileId}`)
    .order('created_at', { ascending: false })
  return (data as Conversation[]) ?? []
}

export async function getMessages(conversationId: string, limit = 50): Promise<Message[]> {
  const { data } = await supabase
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(*)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit)
  return (data as Message[]) ?? []
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, body })
    .select('id')
    .single()
  if (error) return null
  return (data as { id: string }).id
}

export async function markMessagesRead(
  conversationId: string,
  readerId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', readerId)
    .is('read_at', null)
  return !error
}

// ─── Earnings ────────────────────────────────────────────────────────

export async function getEarnings(
  baddieId: string,
  filters?: { status?: string }
): Promise<Earning[]> {
  let q = supabase
    .from('earnings')
    .select('*, shift:shifts(*)')
    .eq('baddie_id', baddieId)
    .order('created_at', { ascending: false })
  if (filters?.status) q = q.eq('status', filters.status)
  const { data } = await q
  return (data as Earning[]) ?? []
}

// ─── Admin Stats ─────────────────────────────────────────────────────

export async function getAdminStats(): Promise<{
  activeClients: number
  activeBaddies: number
  pendingApplications: number
  shiftsThisWeek: number
}> {
  const [clients, baddies, apps, shifts] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client').eq('status', 'active'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'baddie').eq('status', 'active'),
    supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('shifts').select('id', { count: 'exact', head: true })
      .gte('scheduled_date', new Date(Date.now() - 86400000 * new Date().getDay()).toISOString().split('T')[0])
      .lte('scheduled_date', new Date(Date.now() + 86400000 * (6 - new Date().getDay())).toISOString().split('T')[0]),
  ])

  return {
    activeClients: clients.count ?? 0,
    activeBaddies: baddies.count ?? 0,
    pendingApplications: apps.count ?? 0,
    shiftsThisWeek: shifts.count ?? 0,
  }
}
