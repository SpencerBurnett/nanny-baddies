import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code } from 'lucide-react'
import { useAuth, devLogin } from '../lib/auth'
import type { Role } from '../types'

const roleRoutes: Record<Role, string> = {
  client: '/portal',
  baddie: '/b',
  admin: '/admin',
}

export default function Login() {
  const { signIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [devMode, setDevMode] = useState(false)
  const [devPass, setDevPass] = useState('')
  const [devError, setDevError] = useState<string | null>(null)
  const [devRole, setDevRole] = useState<Role>('client')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: err } = await signIn(email, password)
    setSubmitting(false)

    if (err) {
      setError(err)
      return
    }

    navigate(from || '/portal', { replace: true })
  }

  const handleDevLogin = (e: FormEvent) => {
    e.preventDefault()
    setDevError(null)
    if (devPass === '1234') {
      devLogin(devRole)
      window.location.href = roleRoutes[devRole]
    } else {
      setDevError('Wrong password')
    }
  }

  if (authLoading) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl font-semibold text-warm-white">
            Nanny Baddies
          </Link>
          <p className="mt-3 text-muted">Sign in to your account</p>
        </div>

        {!devMode ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-warm-white mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-white mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
                  placeholder="Your password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gold text-midnight font-medium rounded-xl hover:bg-gold-light transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button
                onClick={() => setDevMode(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-soft hover:text-muted transition-colors cursor-pointer"
              >
                <Code className="w-4 h-4" />
                I&apos;m a developer
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleDevLogin} className="space-y-5">
            <div className="bg-charcoal/50 border border-white/5 rounded-xl p-4 text-center">
              <Code className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="text-sm text-muted">Developer preview mode</p>
            </div>

            {devError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                {devError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-warm-white mb-2">Dev Password</label>
              <input
                type="password"
                required
                value={devPass}
                onChange={(e) => setDevPass(e.target.value)}
                className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
                placeholder="Enter developer password"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-white mb-2">View as</label>
              <div className="grid grid-cols-3 gap-2">
                {(['client', 'baddie', 'admin'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setDevRole(r)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      devRole === r
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'bg-slate-dark/50 text-muted border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gold text-midnight font-medium rounded-xl hover:bg-gold-light transition-all cursor-pointer"
            >
              Enter as {devRole.charAt(0).toUpperCase() + devRole.slice(1)}
            </button>

            <button
              type="button"
              onClick={() => { setDevMode(false); setDevPass(''); setDevError(null) }}
              className="w-full py-2 text-sm text-soft hover:text-muted transition-colors cursor-pointer"
            >
              Back to regular login
            </button>
          </form>
        )}

        <p className="text-center mt-8 text-sm text-soft">
          Ready to join?{' '}
          <Link to="/apply" className="text-gold hover:text-gold-light transition-colors">
            Apply as a Client
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
