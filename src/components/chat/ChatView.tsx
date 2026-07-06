import { useEffect, useRef, useState } from 'react'
import { Send, MessageSquare, Lock } from 'lucide-react'
import * as api from '../../lib/api'
import { subscribeToConversation } from '../../lib/realtime'
import type { Conversation, Message, Profile } from '../../types'

interface ChatViewProps {
  profile: Profile
  mode?: 'participant' | 'admin'
}

function counterpart(c: Conversation, profile: Profile, mode: 'participant' | 'admin'): string {
  if (mode === 'admin') {
    return `${c.client?.first_name ?? 'Client'} ↔ ${c.baddie?.first_name ?? 'Baddie'}`
  }
  const other = profile.role === 'client' ? c.baddie : c.client
  return other ? `${other.first_name} ${other.last_name}` : 'Conversation'
}

export default function ChatView({ profile, mode = 'participant' }: ChatViewProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = mode === 'admin' ? api.getAllConversations() : api.getConversations(profile.id)
    load.then((cs) => {
      setConversations(cs)
      setActiveId((prev) => prev ?? cs[0]?.id ?? null)
      setLoading(false)
    })
  }, [profile.id, mode])

  useEffect(() => {
    if (!activeId) return
    api.getMessages(activeId).then((m) => {
      setMessages(m)
      if (mode === 'participant') api.markMessagesRead(activeId, profile.id)
    })
    const unsub = subscribeToConversation(activeId, (msg) => {
      setMessages((prev) => (prev.some((p) => p.id === msg.id) ? prev : [...prev, msg]))
      if (mode === 'participant' && msg.sender_id !== profile.id) {
        api.markMessagesRead(activeId, profile.id)
      }
    })
    return unsub
  }, [activeId, profile.id, mode])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const body = input.trim()
    if (!body || !activeId || mode === 'admin') return
    setSending(true)
    setInput('')
    const id = await api.sendMessage(activeId, profile.id, body)
    if (id) {
      setMessages((prev) =>
        prev.some((p) => p.id === id)
          ? prev
          : [...prev, { id, conversation_id: activeId, sender_id: profile.id, body, read_at: null, created_at: new Date().toISOString() }],
      )
    }
    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-charcoal/50 border border-white/5 rounded-xl p-12 text-center">
        <MessageSquare className="w-10 h-10 text-soft mx-auto mb-4" />
        <h3 className="text-base font-medium text-warm-white mb-2">No conversations yet</h3>
        <p className="text-sm text-muted max-w-sm mx-auto">
          {mode === 'admin'
            ? 'Client–baddie conversations appear here once matches are made.'
            : 'Messaging unlocks the moment you are matched. All contact stays inside the app.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-16rem)] min-h-[28rem]">
      {/* Conversation list */}
      <div className="bg-charcoal/50 border border-white/5 rounded-xl overflow-y-auto md:col-span-1">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`w-full text-left px-4 py-3.5 border-b border-white/5 transition-colors cursor-pointer ${
              activeId === c.id ? 'bg-gold/10' : 'hover:bg-white/[0.02]'
            }`}
          >
            <p className={`text-sm font-medium ${activeId === c.id ? 'text-gold' : 'text-warm-white'}`}>
              {counterpart(c, profile, mode)}
            </p>
            <p className="text-xs text-soft mt-0.5">{mode === 'admin' ? 'Oversight' : 'Tap to open'}</p>
          </button>
        ))}
      </div>

      {/* Thread */}
      <div className="bg-charcoal/50 border border-white/5 rounded-xl flex flex-col md:col-span-2 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-soft" />
          <span className="text-xs text-soft">In-app only — all contact stays on the platform</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-soft text-center py-10">No messages yet. Say hello.</p>
          ) : (
            messages.map((m) => {
              const mine = m.sender_id === profile.id
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    mine ? 'bg-gold text-midnight rounded-br-md' : 'bg-slate-dark/60 text-warm-white rounded-bl-md'
                  }`}>
                    {m.body}
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        {mode === 'participant' && (
          <div className="p-3 border-t border-white/5 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send() }}
              placeholder="Type a message…"
              className="flex-1 bg-slate-dark/50 border border-white/10 rounded-xl px-4 py-2.5 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              className="w-10 h-10 flex items-center justify-center bg-gold text-midnight rounded-xl hover:bg-gold-light transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
