import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { ServiceCategory, ServiceItem, ChecklistItem } from '../../types'

interface SelectedItem {
  service_item_id: string
  custom_note: string
  enabled: boolean
}

export default function ClientChecklist() {
  const { profile } = useAuth()
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [items, setItems] = useState<ServiceItem[]>([])
  const [selected, setSelected] = useState<Map<string, SelectedItem>>(new Map())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getServiceCategories().then(setCategories)
    api.getServiceItems().then(setItems)
  }, [])

  useEffect(() => {
    if (!profile) return
    api.getActiveChecklist(profile.id).then(async (cl) => {
      if (!cl) return
      const clItems = await api.getChecklistItems(cl.id)
      const map = new Map<string, SelectedItem>()
      clItems.forEach((ci: ChecklistItem) => {
        map.set(ci.service_item_id, {
          service_item_id: ci.service_item_id,
          custom_note: ci.custom_note ?? '',
          enabled: ci.enabled,
        })
      })
      setSelected(map)
    })
  }, [profile])

  const toggle = (itemId: string) => {
    setSaved(false)
    setSelected((prev) => {
      const next = new Map(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.set(itemId, { service_item_id: itemId, custom_note: '', enabled: true })
      }
      return next
    })
  }

  const updateNote = (itemId: string, note: string) => {
    setSaved(false)
    setSelected((prev) => {
      const next = new Map(prev)
      const existing = next.get(itemId)
      if (existing) next.set(itemId, { ...existing, custom_note: note })
      return next
    })
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    await api.saveChecklist(profile.id, Array.from(selected.values()))
    setSaving(false)
    setSaved(true)
  }

  const categoryItems = (catId: string) => items.filter((i) => i.category_id === catId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-warm-white">Your Checklist</h1>
          <p className="text-muted text-sm mt-1">Select the services your Baddie handles each shift.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{selected.size} items selected</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-gold text-midnight font-medium text-sm rounded-lg hover:bg-gold-light transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save Checklist'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const catItems = categoryItems(cat.id)
          if (catItems.length === 0) return null
          return (
            <div key={cat.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-base font-semibold text-warm-white">{cat.name}</h3>
                {cat.tagline && <span className="text-xs text-gold/60 italic">{cat.tagline}</span>}
              </div>
              <div className="space-y-2">
                {catItems.map((item) => {
                  const isSelected = selected.has(item.id)
                  const sel = selected.get(item.id)
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggle(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gold/10 border-gold/30 text-gold'
                            : 'bg-slate-dark/30 border-white/5 text-muted hover:border-white/15'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-gold border-gold' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-midnight" />}
                        </span>
                        {item.label}
                      </button>
                      {isSelected && (
                        <input
                          type="text"
                          className="mt-1 ml-8 w-[calc(100%-2rem)] bg-slate-dark/30 border border-white/5 rounded px-3 py-2 text-xs text-muted placeholder-soft focus:outline-none focus:border-gold/30"
                          placeholder="Custom instructions (optional)..."
                          value={sel?.custom_note ?? ''}
                          onChange={(e) => updateNote(item.id, e.target.value)}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
