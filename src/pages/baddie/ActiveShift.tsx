import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Clock } from 'lucide-react'
import * as api from '../../lib/api'
import type { ShiftChecklistItem } from '../../types'

export default function ActiveShift() {
  const { shiftId } = useParams<{ shiftId: string }>()
  const [items, setItems] = useState<ShiftChecklistItem[]>([])

  useEffect(() => {
    if (!shiftId) return
    api.getShiftChecklist(shiftId).then(setItems)
  }, [shiftId])

  const handleToggle = async (item: ShiftChecklistItem) => {
    const completed = !item.completed
    await api.updateShiftChecklistItem(item.id, {
      completed,
      completed_at: completed ? new Date().toISOString() : undefined,
    })
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, completed, completed_at: completed ? new Date().toISOString() : null } : i
      )
    )
  }

  const completed = items.filter((i) => i.completed).length
  const total = items.length
  const progress = total > 0 ? (completed / total) * 100 : 0

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Active Shift</h1>
      <p className="text-muted text-sm mb-6">Check off items as you complete them.</p>

      {/* Progress bar */}
      <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-warm-white font-medium">{completed} / {total} completed</span>
          <span className="text-sm text-gold">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
          <Clock className="w-8 h-8 text-soft mx-auto mb-3" />
          No checklist items for this shift. The admin creates shift checklists during scheduling.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleToggle(item)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all cursor-pointer ${
                item.completed
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-charcoal/50 border-white/5 hover:border-gold/20'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                item.completed ? 'bg-green-500 border-green-500' : 'border-white/20'
              }`}>
                {item.completed && <Check className="w-4 h-4 text-white" />}
              </span>
              <div>
                <p className={`text-sm font-medium ${item.completed ? 'text-muted line-through' : 'text-warm-white'}`}>
                  {item.checklist_item?.service_item?.label ?? 'Service item'}
                </p>
                {item.note && <p className="text-xs text-muted mt-0.5">{item.note}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
