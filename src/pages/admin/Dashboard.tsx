import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Briefcase, FileText, CalendarClock, Code, ChevronDown, ChevronUp } from 'lucide-react'
import * as api from '../../lib/api'

const buildLog = [
  { date: '2026-06-24', phase: 'Foundation', items: [
    'Project scaffolded: Vite + React 19 + TypeScript 5.8 + Tailwind 4 + Framer Motion',
    'Design system: midnight/charcoal/gold palette, Playfair Display + Inter typography',
    'Homepage with hero, service overview, packages, testimonials, FAQ, CTA sections',
    'For Clients page: 13-category service menu, pricing table, FAQ',
    'For Baddies page: perks, earnings calculator, requirements',
    'Client application form: 4-step wizard (basics, lifestyle, home, services)',
    'Baddie application form: multi-step with experience, availability, personality',
  ]},
  { date: '2026-06-24', phase: 'Auth & Portals', items: [
    'Supabase auth integration: email/password sign-in',
    'AuthProvider + useAuth() hook + ProtectedRoute (role-gated)',
    'Login page with email/password form',
    'PortalShell: shared sidebar layout with role-aware navigation',
    'lib/api.ts: centralized data access layer (views never import supabase directly)',
    'types/index.ts: full domain type system (Profile, Match, Shift, Subscription, etc.)',
  ]},
  { date: '2026-06-24', phase: 'Client Portal', items: [
    'Client Dashboard: next shift, baddie info, checklist link, messages link',
    'Client Profile: deep intake form (beverages, food, home, lifestyle preferences)',
    'Client Checklist: build/edit service checklist from 13 categories',
    'Client Schedule: shift calendar view',
    'Client Messages: chat interface (placeholder for realtime)',
    'Client Billing: payment history, subscription management',
  ]},
  { date: '2026-06-24', phase: 'Admin CRM', items: [
    'Admin Dashboard: KPI cards (clients, baddies, applications, shifts) + quick actions',
    'Applications: review client + baddie applications, accept/reject workflow',
    'Client Pipeline: lead → enrolled → active → paused → churned status board',
    'Baddie Pipeline: applicant → bootcamp → active → inactive status board',
    'Matching: assign baddies to clients with match management',
    'Shift Scheduler: create and manage shift blocks',
    'Payments: subscription overview and revenue tracking',
    'Admin Messages: all conversations oversight',
    'Settings: platform configuration',
  ]},
  { date: '2026-06-24', phase: 'Baddie Portal', items: [
    'Baddie Dashboard: today\'s shifts, stats overview',
    'My Clients: assigned clients list with profile access',
    'Schedule: shift calendar with status tracking',
    'Active Shift: live checklist during shift with completion tracking',
    'Earnings: hours, pay, payout history',
    'Messages: chat with assigned clients',
  ]},
  { date: '2026-06-24', phase: 'Deployment', items: [
    'Enrollment page: tier selection with Stripe checkout placeholder',
    'Packages component: pricing display with enrollment links',
    'Navbar: conditional auth state (login/portal toggle)',
    'GitHub repo: SpencerBurnett/nanny-baddies',
    'Vercel deployment: nanny-baddies.vercel.app',
  ]},
  { date: '2026-06-26', phase: 'Transcript Features', items: [
    'Expanded types: TaskRequest, InventoryRoom, InventoryItem, ShiftRecording, ConductAgreement, Bestowment',
    'Expanded api.ts: 15+ new functions for task requests, inventory, recordings, conduct agreements',
    'Enrollment page rewrite: quarterly pricing ($3,600/$7,200/$10,800) + $2,000 paid trial CTA',
    'Client Conduct Agreement: in-app do\'s & don\'ts with digital signature',
    'Client Task Requests: create requests, view status with color-coded icons',
    'Client Inventory: read-only room-by-room view with restock alerts',
    'Baddie Task Requests: accept/decline/hire-out workflow with cost estimates',
    'Baddie Recording: upload shift recordings to Supabase Storage',
    'Baddie Inventory: manage room-by-room inventory with +/- quantity controls',
    'Admin Recordings: review all uploaded shift recordings',
    'Admin Inventory: browse client inventories with search and restock alerts',
    'Apply.tsx: added preferred name + preferred title fields (Mr./Sir/nickname)',
    'Apply.tsx: updated pricing to quarterly billing',
    'All new routes wired in App.tsx',
    'Sidebar nav updated for all 3 portals (9 client / 8 baddie / 11 admin items)',
  ]},
  { date: '2026-06-26', phase: 'Database', items: [
    'Supabase project created (ref: xvnpczirribefzgybjgh, us-east-1)',
    '25 tables with full RLS policies: profiles, applications, tiers, subscriptions, client_profiles, baddie_profiles, conduct_agreements, service_categories, service_items, checklists, checklist_items, matches, shifts, shift_checklist_items, task_requests, inventory_rooms, inventory_items, shift_recordings, conversations, messages, earnings, payouts, bestow_bucks_ledger, bestowments, audit_log',
    'Seeded 3 tiers (Standard/Premium/Elite, quarterly pricing)',
    'Seeded 13 service categories + 63 service items',
    'shift-recordings Storage bucket with RLS',
    'Vercel env vars configured (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)',
  ]},
  { date: '2026-06-26', phase: 'Copy & Marketing', items: [
    'For Clients: "Absolute freedom for your ADHD" hero, dual CTA (Apply + $2K Trial)',
    'For Clients: quarterly pricing table with monthly equivalent',
    'For Clients: conduct agreement preview section (do\'s + zero tolerance)',
    'For Clients: paid trial callout in pricing section',
    'For Baddies: "Capitalize on your beauty with self-respect" headline',
    'For Baddies: "The Wifey Train" training section (bootcamp, shadows, empathy)',
  ]},
  { date: '2026-06-26', phase: 'Developer Tools', items: [
    'Developer bypass login: "I\'m a developer" button on login page',
    'Dev password (1234) + Client/Baddie/Admin role picker',
    'Mock profiles in localStorage, cleared on sign out',
    'Developer build log in Admin CRM (this section)',
  ]},
  { date: '2026-07-05', phase: 'Conduct & Names (calls-derived)', items: [
    'conductRules.ts: single source of truth for do\'s, don\'ts, approved + banned names',
    'Conduct Agreement v2: real enforced rules (no cash tips, app-only contact, no off-hours contact) + approved/banned name chips; version bumped to 2',
    'For Clients conduct preview now sourced from the same rules module',
    'Approved-name system: preferred_title limited to First name / Sir / Boss / Mr. House / nickname',
    'Banned-name guard on nicknames (Apply + Profile) blocks daddy/baby/babe/etc. and disables submit',
    'Baddie "names I accept" captured at application; client\'s chosen name surfaced on baddie Clients detail',
  ]},
  { date: '2026-07-05', phase: 'Onboarding & Orientation (calls-derived)', items: [
    'orientations table + RLS; onboarding funnel statuses (vetted / orientation_booked / orientation_attended / terms_signed)',
    'Client Orientation page: request an in-person Friday orientation at the model house',
    'Onboarding stepper on client Dashboard (Applied → Vetted → Orientation → Terms → Active)',
    'Admin Orientations page: schedule, set location, mark attended — advances client status',
    'Admin vetting gate: "Approve → Orientation" vets the client and queues their orientation',
    'Model-house address configurable in admin Settings',
  ]},
  { date: '2026-07-05', phase: 'Messaging & Payments', items: [
    'Realtime messaging: lib/realtime.ts (Supabase Realtime on messages)',
    'Shared ChatView (conversation list + thread + composer) wired into client, baddie, and admin Messages',
    'Admin message oversight (read-only) via getAllConversations',
    'Live unread badge in the sidebar (getUnreadCount + inbox subscription)',
    'Stripe scaffolding: lib/stripe.ts + edge functions (stripe-checkout / webhook / portal); Enrollment wired with graceful fallback — awaiting live keys',
    'Bug fix: tier price field aligned to DB (quarterly_price) — Enrollment no longer white-screens on live data',
  ]},
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({ activeClients: 0, activeBaddies: 0, pendingApplications: 0, shiftsThisWeek: 0 })

  useEffect(() => {
    api.getAdminStats().then(setStats)
  }, [])

  const cards = [
    { label: 'Active Clients', value: stats.activeClients, icon: Users, to: '/admin/clients', color: 'text-gold' },
    { label: 'Active Baddies', value: stats.activeBaddies, icon: Briefcase, to: '/admin/baddies', color: 'text-purple-400' },
    { label: 'Pending Applications', value: stats.pendingApplications, icon: FileText, to: '/admin/applications', color: 'text-blue-400' },
    { label: 'Shifts This Week', value: stats.shiftsThisWeek, icon: CalendarClock, to: '/admin/shifts', color: 'text-green-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Admin Dashboard</h1>
      <p className="text-muted mb-10">Overview of the Nanny Baddies operation.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-charcoal/50 border border-white/5 rounded-xl p-6 hover:border-gold/20 transition-all"
          >
            <card.icon className={`w-6 h-6 ${card.color} mb-3`} />
            <p className="text-3xl font-display font-semibold text-warm-white">{card.value}</p>
            <p className="text-sm text-muted mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-semibold text-warm-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/admin/applications" className="block px-4 py-3 bg-slate-dark/30 rounded-lg text-sm text-muted hover:text-gold transition-colors">
              Review pending applications →
            </Link>
            <Link to="/admin/matching" className="block px-4 py-3 bg-slate-dark/30 rounded-lg text-sm text-muted hover:text-gold transition-colors">
              Match clients with baddies →
            </Link>
            <Link to="/admin/shifts" className="block px-4 py-3 bg-slate-dark/30 rounded-lg text-sm text-muted hover:text-gold transition-colors">
              Schedule shifts →
            </Link>
          </div>
        </div>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-semibold text-warm-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Database</span>
              <span className="text-green-400">Connected</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Stripe</span>
              <span className="text-yellow-400">Pending setup</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Messaging</span>
              <span className="text-yellow-400">Phase 6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Build Log */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-5 h-5 text-gold" />
          <h3 className="text-lg font-display font-semibold text-warm-white">Developer</h3>
        </div>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warm-white">Build Log</p>
              <p className="text-xs text-soft mt-0.5">
                {buildLog.reduce((sum, p) => sum + p.items.length, 0)} features across {buildLog.length} phases
              </p>
            </div>
            <span className="text-xs text-gold/60 font-mono">v0.1.0</span>
          </div>

          <div className="divide-y divide-white/5">
            {buildLog.map((phase) => (
              <BuildPhase key={phase.phase} phase={phase} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BuildPhase({ phase }: { phase: typeof buildLog[number] }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-gold/60 shrink-0" />
          <span className="text-sm font-medium text-warm-white">{phase.phase}</span>
          <span className="text-xs text-soft">({phase.items.length})</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-soft font-mono">{phase.date}</span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-soft" />
          ) : (
            <ChevronDown className="w-4 h-4 text-soft" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-6 pb-4">
          <div className="ml-4 border-l border-white/5 pl-4 space-y-2">
            {phase.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                <span className="text-gold/40 mt-0.5 shrink-0">›</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
