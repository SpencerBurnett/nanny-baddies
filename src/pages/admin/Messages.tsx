import { MessageSquare } from 'lucide-react'

export default function AdminMessages() {
  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Messages</h1>
      <p className="text-muted text-sm mb-8">Oversight of all platform conversations.</p>

      <div className="bg-charcoal/50 border border-white/5 rounded-xl p-12 text-center">
        <MessageSquare className="w-10 h-10 text-soft mx-auto mb-4" />
        <h3 className="text-base font-medium text-warm-white mb-2">Messaging coming soon</h3>
        <p className="text-sm text-muted max-w-sm mx-auto">
          Admin message oversight launches with Phase 6. All client–baddie conversations are monitored here.
        </p>
      </div>
    </div>
  )
}
