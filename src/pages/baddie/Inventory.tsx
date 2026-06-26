import { useEffect, useState } from 'react'
import { Plus, Trash2, Package } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { InventoryRoom, InventoryItem, Match } from '../../types'

export default function BaddieInventory() {
  const { profile } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [rooms, setRooms] = useState<InventoryRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newItemName, setNewItemName] = useState('')
  const [newItemRoom, setNewItemRoom] = useState('')

  useEffect(() => {
    if (!profile) return
    api.getMatches({ baddie_id: profile.id, status: 'active' }).then((m) => {
      setMatches(m)
      if (m.length === 1) {
        setSelectedClient(m[0].client_id)
        loadRooms(m[0].client_id)
      }
    })
  }, [profile])

  const loadRooms = async (clientId: string) => {
    setLoading(true)
    const data = await api.getInventoryRooms(clientId)
    setRooms(data)
    setLoading(false)
  }

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId)
    if (clientId) loadRooms(clientId)
    else setRooms([])
  }

  const handleAddRoom = async () => {
    if (!selectedClient || !newRoomName) return
    await api.createInventoryRoom(selectedClient, newRoomName, rooms.length)
    setNewRoomName('')
    loadRooms(selectedClient)
  }

  const handleAddItem = async () => {
    if (!newItemRoom || !newItemName) return
    await api.createInventoryItem({ room_id: newItemRoom, item_name: newItemName, quantity: 1 })
    setNewItemName('')
    setNewItemRoom('')
    loadRooms(selectedClient)
  }

  const handleUpdateQuantity = async (item: InventoryItem, delta: number) => {
    if (!profile) return
    const newQty = Math.max(0, item.quantity + delta)
    await api.updateInventoryItem(item.id, {
      quantity: newQty,
      last_checked_at: new Date().toISOString(),
      last_checked_by: profile.id,
    })
    loadRooms(selectedClient)
  }

  const handleDeleteItem = async (id: string) => {
    await api.deleteInventoryItem(id)
    loadRooms(selectedClient)
  }

  const handleDeleteRoom = async (id: string) => {
    await api.deleteInventoryRoom(id)
    loadRooms(selectedClient)
  }

  const inputClass = 'bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 transition-colors'

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-1">Home Inventory</h1>
      <p className="text-muted text-sm mb-8">Manage your client&apos;s home inventory room by room.</p>

      {matches.length > 1 && (
        <select
          value={selectedClient}
          onChange={(e) => handleClientChange(e.target.value)}
          className={`${inputClass} w-full mb-6`}
        >
          <option value="">Select client...</option>
          {matches.map((m) => (
            <option key={m.client_id} value={m.client_id}>
              {m.client?.first_name} {m.client?.last_name}
            </option>
          ))}
        </select>
      )}

      {selectedClient && (
        <>
          {/* Add Room */}
          <div className="bg-charcoal/50 border border-white/5 rounded-xl p-4 mb-6 flex gap-3">
            <input
              type="text"
              placeholder="New room name (Kitchen, Master Bath...)"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            <button
              onClick={handleAddRoom}
              disabled={!newRoomName}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gold text-midnight font-medium rounded-lg text-sm hover:bg-gold-light transition-all disabled:opacity-30 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Room
            </button>
          </div>

          {/* Add Item */}
          {rooms.length > 0 && (
            <div className="bg-charcoal/50 border border-white/5 rounded-xl p-4 mb-6 flex gap-3">
              <select
                value={newItemRoom}
                onChange={(e) => setNewItemRoom(e.target.value)}
                className={`${inputClass} w-48`}
              >
                <option value="">Room...</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Item name (Paper Towels, Dish Soap...)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <button
                onClick={handleAddItem}
                disabled={!newItemRoom || !newItemName}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gold/20 text-gold border border-gold/30 font-medium rounded-lg text-sm hover:bg-gold/30 transition-all disabled:opacity-30 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
              <Package className="w-8 h-8 text-soft mx-auto mb-3" />
              <p>No rooms set up yet. Add the first room above.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {rooms.map((room) => (
                <div key={room.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-warm-white">{room.name}</h3>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-red-400/50 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {room.items && room.items.length > 0 ? (
                    <div className="space-y-2">
                      {room.items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                            item.needs_restock ? 'bg-red-500/5 border border-red-500/10' : 'bg-slate-dark/30'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {item.needs_restock && (
                              <span className="w-2 h-2 bg-red-400 rounded-full shrink-0" />
                            )}
                            <span className="text-sm text-warm-white">{item.item_name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateQuantity(item, -1)} className="w-7 h-7 rounded bg-white/5 text-muted hover:text-warm-white flex items-center justify-center text-sm cursor-pointer">−</button>
                            <span className={`w-8 text-center text-sm font-medium ${item.needs_restock ? 'text-red-400' : 'text-warm-white'}`}>
                              {item.quantity}
                            </span>
                            <button onClick={() => handleUpdateQuantity(item, 1)} className="w-7 h-7 rounded bg-white/5 text-muted hover:text-warm-white flex items-center justify-center text-sm cursor-pointer">+</button>
                            <button onClick={() => handleDeleteItem(item.id)} className="ml-2 text-red-400/30 hover:text-red-400 transition-colors cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-soft">No items in this room. Add items using the form above.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
