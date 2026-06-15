import { useState } from 'react'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    companyName: 'Nanny Baddies',
    contactEmail: 'hello@nannybaddies.com',
    defaultShiftHours: 4,
    defaultHourlyRate: 35,
    commitmentCycleDays: 90,
    maxClientsPerBaddie: 5,
    requireBackgroundCheck: true,
    autoMatchNotifications: true,
  })

  const handleSave = () => {
    // Placeholder: save to Supabase settings table
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-warm-white">Settings</h1>
          <p className="text-muted text-sm mt-1">Platform configuration.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gold text-midnight font-medium rounded-lg px-5 py-2.5 text-sm hover:bg-gold/90 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-warm-white mb-5">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-warm-white"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-warm-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-warm-white mb-5">Operations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Default Shift Duration (hours)</label>
              <input
                type="number"
                value={settings.defaultShiftHours}
                onChange={(e) => setSettings({ ...settings, defaultShiftHours: Number(e.target.value) })}
                className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-warm-white"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Default Hourly Rate ($)</label>
              <input
                type="number"
                value={settings.defaultHourlyRate}
                onChange={(e) => setSettings({ ...settings, defaultHourlyRate: Number(e.target.value) })}
                className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-warm-white"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Commitment Cycle (days)</label>
              <input
                type="number"
                value={settings.commitmentCycleDays}
                onChange={(e) => setSettings({ ...settings, commitmentCycleDays: Number(e.target.value) })}
                className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-warm-white"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Max Clients Per Baddie</label>
              <input
                type="number"
                value={settings.maxClientsPerBaddie}
                onChange={(e) => setSettings({ ...settings, maxClientsPerBaddie: Number(e.target.value) })}
                className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-warm-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6 md:col-span-2">
          <h3 className="text-sm font-semibold text-warm-white mb-5">Toggles</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-warm-white">Require Background Check</p>
                <p className="text-xs text-muted">All baddies must pass a background check before activation.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireBackgroundCheck}
                onChange={(e) => setSettings({ ...settings, requireBackgroundCheck: e.target.checked })}
                className="w-5 h-5 rounded accent-gold"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-warm-white">Auto-Match Notifications</p>
                <p className="text-xs text-muted">Email both parties when a new match is created.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoMatchNotifications}
                onChange={(e) => setSettings({ ...settings, autoMatchNotifications: e.target.checked })}
                className="w-5 h-5 rounded accent-gold"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
