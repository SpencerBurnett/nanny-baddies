import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import {
  LayoutDashboard, User, CheckSquare, Calendar, MessageSquare, CreditCard,
  Users, UserPlus, GitMerge, CalendarClock, DollarSign, Settings, LogOut, Briefcase,
  FileText, ClipboardList, Package, Mic, FileAudio
} from 'lucide-react'
import type { Role } from '../../types'

interface NavItem {
  label: string
  to: string
  icon: React.FC<{ className?: string }>
}

const navItems: Record<Role, NavItem[]> = {
  client: [
    { label: 'Dashboard', to: '/portal', icon: LayoutDashboard },
    { label: 'My Profile', to: '/portal/profile', icon: User },
    { label: 'Checklist', to: '/portal/checklist', icon: CheckSquare },
    { label: 'Schedule', to: '/portal/schedule', icon: Calendar },
    { label: 'Requests', to: '/portal/requests', icon: ClipboardList },
    { label: 'Inventory', to: '/portal/inventory', icon: Package },
    { label: 'Agreement', to: '/portal/agreement', icon: FileText },
    { label: 'Messages', to: '/portal/messages', icon: MessageSquare },
    { label: 'Billing', to: '/portal/billing', icon: CreditCard },
  ],
  baddie: [
    { label: 'Dashboard', to: '/b', icon: LayoutDashboard },
    { label: 'My Clients', to: '/b/clients', icon: Users },
    { label: 'Schedule', to: '/b/schedule', icon: Calendar },
    { label: 'Requests', to: '/b/requests', icon: ClipboardList },
    { label: 'Recording', to: '/b/recording', icon: Mic },
    { label: 'Inventory', to: '/b/inventory', icon: Package },
    { label: 'Earnings', to: '/b/earnings', icon: DollarSign },
    { label: 'Messages', to: '/b/messages', icon: MessageSquare },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Applications', to: '/admin/applications', icon: UserPlus },
    { label: 'Clients', to: '/admin/clients', icon: Users },
    { label: 'Baddies', to: '/admin/baddies', icon: Briefcase },
    { label: 'Matching', to: '/admin/matching', icon: GitMerge },
    { label: 'Shifts', to: '/admin/shifts', icon: CalendarClock },
    { label: 'Recordings', to: '/admin/recordings', icon: FileAudio },
    { label: 'Inventory', to: '/admin/inventory', icon: Package },
    { label: 'Payments', to: '/admin/payments', icon: DollarSign },
    { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ],
}

const roleLabels: Record<Role, string> = {
  client: 'Client Portal',
  baddie: 'Baddie Portal',
  admin: 'Admin CRM',
}

export default function PortalShell({ role }: { role: Role }) {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const items = navItems[role]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const isActive = (to: string) => {
    if (to === '/portal' || to === '/b' || to === '/admin') {
      return location.pathname === to
    }
    return location.pathname.startsWith(to)
  }

  return (
    <div className="min-h-screen flex bg-midnight text-warm-white">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="font-display text-xl font-semibold text-warm-white hover:text-gold transition-colors">
            Nanny Baddies
          </Link>
          <p className="text-xs text-gold mt-1 tracking-wide uppercase">{roleLabels[role]}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive(item.to)
                  ? 'bg-gold/10 text-gold'
                  : 'text-muted hover:text-warm-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          {profile && (
            <div className="flex items-center gap-3 mb-3 px-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-semibold">
                {profile.first_name[0]}{profile.last_name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-warm-white truncate">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-xs text-soft truncate">{profile.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-warm-white hover:bg-white/5 transition-colors w-full cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
