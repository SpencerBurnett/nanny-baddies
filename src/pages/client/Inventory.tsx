import { useEffect, useState } from 'react'
import { Package, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { InventoryRoom } from '../../types'

export default function ClientInventory() {
  const { profile } = useAuth()
  const [rooms, setRooms] = useState<InventoryRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    api.getInventoryRooms(profile.id).then((data) => {
      setRooms(data)
      setLoading(false)
    })
  }, [profile])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const restockCount = rooms.reduce(
    (sum, room) => sum + (room.items?.filter((i) => i.needs_restock).length ?? 0),
    0
  )

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-1">Home Inventory</h1>
      <p className="text-muted text-sm mb-8">Your Nanny Baddie updates this after every shift.</p>

      {restockCount > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-400">
            {restockCount} item{restockCount !== 1 ? 's' : ''} need{restockCount === 1 ? 's' : ''} restocking
          </p>
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
          <Package className="w-8 h-8 text-soft mx-auto mb-3" />
          <p>No inventory recorded yet.</p>
          <p className="text-xs text-soft mt-1">Your Nanny Baddie will set this up during her first visit.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-warm-white mb-4">{room.name}</h3>
              {room.items && room.items.length > 0 ? (
                <div className="space-y-2">
                  {room.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${
                        item.needs_restock ? 'bg-red-500/5 border border-red-500/10' : 'bg-slate-dark/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.needs_restock && (
                          <span className="w-2 h-2 bg-red-400 rounded-full shrink-0" />
                        )}
                        <span className="text-sm text-warm-white">{item.item_name}</span>
                        {item.notes && (
                          <span className="text-xs text-soft">— {item.notes}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${item.needs_restock ? 'text-red-400' : 'text-muted'}`}>
                          Qty: {item.quantity}
                        </span>
                        {item.last_checked_at && (
                          <span className="text-xs text-soft">
                            Checked {new Date(item.last_checked_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-soft">No items in this room yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
