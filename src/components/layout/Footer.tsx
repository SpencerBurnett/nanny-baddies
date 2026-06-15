import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-semibold text-warm-white mb-4">
              Nanny Baddies
            </h3>
            <p className="text-muted max-w-sm leading-relaxed">
              Premium domestic lifestyle management for men who expect more. Austin, TX.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-warm-white tracking-wide uppercase mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              <li><Link to="/for-clients" className="text-muted hover:text-gold transition-colors text-sm">For Clients</Link></li>
              <li><Link to="/for-baddies" className="text-muted hover:text-gold transition-colors text-sm">For Baddies</Link></li>
              <li><Link to="/apply" className="text-muted hover:text-gold transition-colors text-sm">Apply as Client</Link></li>
              <li><Link to="/apply-baddie" className="text-muted hover:text-gold transition-colors text-sm">Join the Team</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-warm-white tracking-wide uppercase mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="text-muted text-sm">Austin, Texas</li>
              <li>
                <a href="mailto:hello@nannybaddies.com" className="text-muted hover:text-gold transition-colors text-sm">
                  hello@nannybaddies.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-soft">
            &copy; 2026 Nanny Baddies. All rights reserved.
          </p>
          <p className="text-sm text-soft">
            By invitation only.
          </p>
        </div>
      </div>
    </footer>
  )
}
