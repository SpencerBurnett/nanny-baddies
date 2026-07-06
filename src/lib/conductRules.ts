import type { PreferredTitle } from '../types'

// Single source of truth for the Nanny Baddies conduct rules.
// Rendered in the client Conduct Agreement, the For-Clients preview,
// and the approved-name pickers so the site and app never drift.

export const CONDUCT_VERSION = 2

export const DOS: string[] = [
  'Compliment professionally — "you look great today," "thank you for the hard work"',
  'Address her only by an approved name (see below)',
  'Treat your Nanny Baddie as a business partner',
  'Communicate every preference and request through the app',
  'Tip digitally through the platform — never in cash',
  'Leave feedback through the rating system after each shift',
]

export const DONTS: string[] = [
  'No touching — zero tolerance, immediate removal from the platform',
  'No sexual or personal information exchange (phone numbers, socials, private life)',
  'No contact outside the app — off-platform texting or calling ends the membership',
  'No cash tips — all compensation flows through the platform',
  'No hanging out or contact outside scheduled hours',
  'No adult or sexual activity while she is present',
  'No banned names or sexualized language (see the banned list below)',
]

// What a client may choose to be called. Sir / Boss / Mr. House are the
// pre-approved address terms from the standards; first name and a custom
// nickname are also allowed (nicknames are screened against BANNED_NAMES).
export interface NameOption {
  value: PreferredTitle
  label: string
  hint?: string
}

export const NAME_OPTIONS: NameOption[] = [
  { value: 'first_name', label: 'My first name' },
  { value: 'sir', label: 'Sir' },
  { value: 'boss', label: 'Boss' },
  { value: 'mr_house', label: 'Mr. House' },
  { value: 'nickname', label: 'A custom nickname', hint: 'Screened against the banned list' },
]

// Pre-approved address terms a baddie can opt into using.
export const APPROVED_NAMES: string[] = ['Sir', 'Boss', 'Mr. House']

// Never permitted, regardless of client request.
export const BANNED_NAMES: string[] = [
  'daddy', 'baby', 'babe', 'sugar', 'honey',
  'pookie bear', 'pookie', 'man-meat', 'man meat', 'sweetie', 'sexy',
]

export function isBannedName(input: string): boolean {
  const n = input.trim().toLowerCase()
  if (!n) return false
  return BANNED_NAMES.some((b) => n === b || n.includes(b))
}

// Human-readable label for a stored preferred_title + optional custom name.
export function displayPreferredName(
  title: PreferredTitle | null,
  firstName: string,
  nickname?: string | null,
): string {
  switch (title) {
    case 'sir': return 'Sir'
    case 'boss': return 'Boss'
    case 'mr_house': return 'Mr. House'
    case 'nickname': return nickname?.trim() || firstName
    case 'first_name':
    default: return firstName
  }
}
