import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../lib/auth'

const links = [
  { label: 'For Clients', to: '/for-clients' },
  { label: 'For Baddies', to: '/for-baddies' },
]

const portalHome: Record<string, string> = {
  client: '/portal',
  baddie: '/b',
  admin: '/admin',
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { user, profile, signOut } = useAuth()

  const portalLink = profile ? portalHome[profile.role] || '/portal' : '/portal'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-midnight/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-2xl font-display font-semibold text-warm-white tracking-tight group-hover:text-gold transition-colors">
            Nanny Baddies
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wide transition-colors ${
                location.pathname === link.to
                  ? 'text-gold'
                  : 'text-muted hover:text-warm-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={portalLink}
                  className="px-5 py-2.5 text-sm font-medium bg-gold text-midnight rounded-lg hover:bg-gold-light transition-all"
                >
                  My Portal
                </Link>
                <button
                  onClick={signOut}
                  className="px-5 py-2.5 text-sm font-medium border border-white/10 text-muted rounded-lg hover:text-warm-white hover:border-white/20 transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-muted hover:text-warm-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/enroll"
                  className="px-5 py-2.5 text-sm font-medium bg-gold text-midnight rounded-lg hover:bg-gold-light transition-all"
                >
                  Enroll Now
                </Link>
                <Link
                  to="/apply-baddie"
                  className="px-5 py-2.5 text-sm font-medium border border-gold/50 text-gold rounded-lg hover:bg-gold/10 transition-all"
                >
                  Join the Team
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-warm-white p-2"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-charcoal border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-base py-2 ${
                    location.pathname === link.to ? 'text-gold' : 'text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-2">
                {user ? (
                  <>
                    <Link
                      to={portalLink}
                      onClick={() => setOpen(false)}
                      className="px-5 py-3 text-center text-sm font-medium bg-gold text-midnight rounded-lg"
                    >
                      My Portal
                    </Link>
                    <button
                      onClick={() => { signOut(); setOpen(false) }}
                      className="px-5 py-3 text-center text-sm font-medium border border-white/10 text-muted rounded-lg cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="px-5 py-3 text-center text-sm font-medium text-muted"
                    >
                      Login
                    </Link>
                    <Link
                      to="/enroll"
                      onClick={() => setOpen(false)}
                      className="px-5 py-3 text-center text-sm font-medium bg-gold text-midnight rounded-lg"
                    >
                      Enroll Now
                    </Link>
                    <Link
                      to="/apply-baddie"
                      onClick={() => setOpen(false)}
                      className="px-5 py-3 text-center text-sm font-medium border border-gold/50 text-gold rounded-lg"
                    >
                      Join the Team
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
