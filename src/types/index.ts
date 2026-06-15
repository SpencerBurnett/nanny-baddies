export type Role = 'client' | 'baddie' | 'admin'

export type ProfileStatus =
  | 'pending' | 'lead' | 'enrolled' | 'active' | 'paused' | 'churned'
  | 'applicant' | 'bootcamp' | 'inactive'

export interface Profile {
  id: string
  role: Role
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  status: ProfileStatus
  created_at: string
  updated_at: string
}

export type ApplicationType = 'client' | 'baddie'
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected'

export interface Application {
  id: string
  type: ApplicationType
  status: ApplicationStatus
  data: Record<string, unknown>
  email: string
  first_name: string
  last_name: string
  phone: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Tier {
  id: string
  slug: string
  name: string
  shifts_per_week: number
  monthly_price: number
  stripe_price_id: string
  features: string[]
  created_at: string
}

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'paused'

export interface Subscription {
  id: string
  profile_id: string
  tier_id: string
  tier?: Tier
  stripe_customer_id: string
  stripe_subscription_id: string
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  cycle_count: number
  created_at: string
  updated_at: string
}

export interface ClientProfile {
  id: string
  profile_id: string
  age: number | null
  neighborhood: string | null
  coffee_order: string | null
  water_preference: string | null
  allergies: string | null
  snack_preferences: string | null
  condiments: string | null
  cannabis: 'yes-roll' | 'yes-no-roll' | 'no' | null
  supplement_schedule: string | null
  conversation_preference: 'quiet' | 'light' | 'social' | null
  home_type: 'house' | 'condo' | 'apartment' | 'penthouse' | null
  bed_making_standard: string | null
  preferred_drinkware: string | null
  temperature_preference: string | null
  scent_preference: string | null
  music_preference: string | null
  has_pets: boolean
  pet_details: string | null
  has_plants: boolean
  plant_details: string | null
  additional_notes: string | null
  created_at: string
  updated_at: string
}

export interface BaddieProfile {
  id: string
  profile_id: string
  age: number | null
  neighborhood: string | null
  instagram: string | null
  current_job: string | null
  relevant_experience: string | null
  cleaning_experience: 'professional' | 'personal' | 'learning' | null
  cooking_skills: 'advanced' | 'intermediate' | 'basic' | 'learning' | null
  why_join: string | null
  availability: string[]
  shifts_per_week: '1-2' | '3-4' | '5+' | null
  start_date: string | null
  has_transportation: 'car' | 'other' | 'no' | null
  willing_to_bootcamp: 'yes' | 'tell-me-more' | null
  strength_description: string | null
  comfort_level: 'very' | 'comfortable' | 'growing' | null
  boundaries_agreement: 'agree' | 'questions' | null
  additional_notes: string | null
  hourly_rate: number
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: string
  slug: string
  name: string
  tagline: string | null
  sort_order: number
}

export interface ServiceItem {
  id: string
  category_id: string
  label: string
  sort_order: number
}

export interface Checklist {
  id: string
  client_id: string
  version: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ChecklistItem {
  id: string
  checklist_id: string
  service_item_id: string
  service_item?: ServiceItem
  custom_note: string | null
  enabled: boolean
  sort_order: number
}

export type MatchStatus = 'active' | 'paused' | 'ended'

export interface Match {
  id: string
  client_id: string
  baddie_id: string
  client?: Profile
  baddie?: Profile
  status: MatchStatus
  matched_by: string | null
  started_at: string
  ended_at: string | null
  notes: string | null
  created_at: string
}

export type ShiftStatus = 'scheduled' | 'in_progress' | 'completed' | 'canceled' | 'no_show'

export interface Shift {
  id: string
  match_id: string
  client_id: string
  baddie_id: string
  client?: Profile
  baddie?: Profile
  scheduled_date: string
  start_time: string
  end_time: string
  status: ShiftStatus
  cancel_reason: string | null
  started_at: string | null
  completed_at: string | null
  baddie_notes: string | null
  client_rating: number | null
  created_at: string
  updated_at: string
}

export interface ShiftChecklistItem {
  id: string
  shift_id: string
  checklist_item_id: string
  checklist_item?: ChecklistItem
  completed: boolean
  completed_at: string | null
  note: string | null
  photo_url: string | null
}

export interface Conversation {
  id: string
  match_id: string
  client_id: string
  baddie_id: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender?: Profile
  body: string
  read_at: string | null
  created_at: string
}

export type EarningStatus = 'pending' | 'approved' | 'paid'

export interface Earning {
  id: string
  baddie_id: string
  shift_id: string
  shift?: Shift
  hours: number
  rate: number
  amount: number
  status: EarningStatus
  created_at: string
}

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Payout {
  id: string
  baddie_id: string
  amount: number
  stripe_transfer_id: string | null
  status: PayoutStatus
  period_start: string
  period_end: string
  created_at: string
}
