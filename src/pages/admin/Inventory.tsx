import { useEffect, useState } from 'react'
import { Package, AlertTriangle, Search, ChevronRight } from 'lucide-react'
import * as api from '../../lib/api'
import type { Profile, InventoryRoom } from '../../types'

export default function AdminInventory() {
  const [clients, setClients] = useState<Profile[]>([])
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [rooms, setRooms] = useState<InventoryRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getProfiles({ role: 'client' }).then((data) => {
      setClients(data)
      setLoading(false)
    })
  }, [])

  const handleSelectClient = async (clientId: string) => {
    setSelectedClient(clientId)
    setRoomsLoading(true)
    const data = await api.getInventoryRooms(clientId)
    setRooms(data)
    setRoomsLoading(false)
  }

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase()
    return `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(q)
  })

  const restockCount = rooms.reduce(
    (sum, room) => sum + (room.items?.filter((i) => i.needs_restock).length ?? 0),
    0
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-1">Client Inventories</h1>
      <p className="text-muted text-sm mb-8">View and manage home inventories for all clients.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client list */}
        <div className="lg:col-span-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div className="bg-charcoal/50 border border-white/5 rounded-xl overflow-hidden">
            {filtered.map((client) => (
              <button
                key={client.id}
                onClick={() => handleSelectClient(client.id)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-white/5 last:border-0 transition-colors cursor-pointer ${
                  selectedClient === client.id ? 'bg-gold/5 border-l-2 border-l-gold' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-warm-white">
                    {client.first_name} {client.last_name}
                  </p>
                  <p className="text-xs text-soft">{client.email}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-soft" />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted text-center py-6">No clients found.</p>
            )}
          </div>
        </div>

        {/* Inventory detail */}
        <div className="lg:col-span-2">
          {!selectedClient ? (
            <div className="bg-charcoal/50 border border-white/5 rounded-xl p-12 text-center">
              <Package className="w-8 h-8 text-soft mx-auto mb-3" />
              <p className="text-muted text-sm">Select a client to view their inventory.</p>
            </div>
          ) : roomsLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {restockCount > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
                  <p className="text-sm text-yellow-400">
                    {restockCount} item{restockCount !== 1 ? 's' : ''} need{restockCount === 1 ? 's' : ''} restocking
                  </p>
                </div>
              )}

              {rooms.length === 0 ? (
                <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
                  No inventory set up for this client yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-warm-white mb-3">{room.name}</h3>
                      {room.items && room.items.length > 0 ? (
                        <div className="space-y-1.5">
                          {room.items.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${
                                item.needs_restock ? 'bg-red-500/5 border border-red-500/10' : 'bg-slate-dark/30'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {item.needs_restock && <span className="w-2 h-2 bg-red-400 rounded-full" />}
                                <span className="text-warm-white">{item.item_name}</span>
                                {item.notes && <span className="text-xs text-soft">— {item.notes}</span>}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={item.needs_restock ? 'text-red-400 font-medium' : 'text-muted'}>
                                  {item.quantity}
                                </span>
                                {item.last_checked_at && (
                                  <span className="text-xs text-soft">
                                    {new Date(item.last_checked_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-soft">No items.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
