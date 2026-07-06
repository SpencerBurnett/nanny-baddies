import { supabase } from './supabase'
import type { Message } from '../types'

// Subscribe to new messages in a single conversation. Returns an unsubscribe fn.
// The `messages` table is in the `supabase_realtime` publication.
export function subscribeToConversation(
  conversationId: string,
  onInsert: (message: Message) => void,
): () => void {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onInsert(payload.new as Message),
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Subscribe to any new message across all of this profile's conversations —
// used to keep the sidebar unread badge live. Fires on inserts not sent by them.
export function subscribeToInbox(
  profileId: string,
  onIncoming: (message: Message) => void,
): () => void {
  const channel = supabase
    .channel(`inbox:${profileId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        const msg = payload.new as Message
        if (msg.sender_id !== profileId) onIncoming(msg)
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
