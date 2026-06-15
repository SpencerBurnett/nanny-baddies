import { MessageSquare } from 'lucide-react'

export default function BaddieMessages() {
  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Messages</h1>
      <p className="text-muted text-sm mb-8">Chat with your assigned clients.</p>

      <div className="bg-charcoal/50 border border-white/5 rounded-xl p-12 text-center">
        <MessageSquare className="w-10 h-10 text-soft mx-auto mb-4" />
        <h3 className="text-base font-medium text-warm-white mb-2">Messaging coming soon</h3>
        <p className="text-sm text-muted max-w-sm mx-auto">
          In-app messaging launches with Phase 6. All client communication stays within the platform.
        </p>
      </div>
    </div>
  )
}
