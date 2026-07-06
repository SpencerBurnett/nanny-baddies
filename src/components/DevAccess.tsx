import { useState } from 'react'
import { Code, X, Shield, User, Briefcase } from 'lucide-react'
import { devLogin } from '../lib/auth'
import type { Role } from '../types'

const roleRoutes: Record<Role, string> = {
  client: '/portal',
  baddie: '/b',
  admin: '/admin',
}

const roles: { role: Role; label: string; icon: React.FC<{ className?: string }> }[] = [
  { role: 'admin', label: 'Admin', icon: Shield },
  { role: 'client', label: 'Client', icon: User },
  { role: 'baddie', label: 'Baddie', icon: Briefcase },
]

// Floating developer launcher: password-gates a jump into any portal without
// real auth. Uses the same localStorage dev-mode bypass as the login page.
export default function DevAccess() {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const enter = (role: Role) => {
    if (password !== '1234') {
      setError(true)
      return
    }
    devLogin(role)
    window.location.href = roleRoutes[role]
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="bg-charcoal border border-white/10 rounded-2xl p-5 w-72 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-warm-white">Developer Access</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-soft hover:text-warm-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-warm-white placeholder-soft focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
          />
          {error && <p className="text-xs text-red-400 mt-1.5">Wrong password</p>}

          <p className="text-xs text-soft mt-4 mb-2">Enter a section:</p>
          <div className="grid grid-cols-3 gap-2">
            {roles.map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                onClick={() => enter(role)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-slate-dark/50 border border-white/10 hover:border-gold/40 hover:bg-gold/5 transition-all cursor-pointer"
              >
                <Icon className="w-4 h-4 text-gold" />
                <span className="text-xs text-warm-white">{label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-charcoal/90 backdrop-blur border border-white/10 rounded-full px-4 py-2.5 shadow-xl opacity-60 hover:opacity-100 hover:border-gold/40 transition-all cursor-pointer"
        >
          <Code className="w-4 h-4 text-gold" />
          <span className="text-xs font-medium text-warm-white">Developer</span>
        </button>
      )}
    </div>
  )
}
