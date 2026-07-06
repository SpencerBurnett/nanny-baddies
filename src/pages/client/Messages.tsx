import { useAuth } from '../../lib/auth'
import ChatView from '../../components/chat/ChatView'

export default function ClientMessages() {
  const { profile } = useAuth()
  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Messages</h1>
      <p className="text-muted text-sm mb-8">Chat with your Nanny Baddie.</p>
      {profile && <ChatView profile={profile} />}
    </div>
  )
}
