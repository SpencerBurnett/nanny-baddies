import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { signIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
