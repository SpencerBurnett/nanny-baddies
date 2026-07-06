import { useAuth } from '../../lib/auth'
import ChatView from '../../components/chat/ChatView'

export default function AdminMessages() {
  const { profile } = useAuth()
  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Messages</h1>
      <p className="text-muted text-sm mb-8">Oversight of all platform conversations.</p>
      {profile && <ChatView profile={profile} mode="admin" />}
    </div>
  )
}
