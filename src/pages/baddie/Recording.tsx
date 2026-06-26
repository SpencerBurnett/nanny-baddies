import { useEffect, useState, useRef } from 'react'
import { Upload, FileAudio, Download, Clock } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { ShiftRecording, Shift } from '../../types'

export default function BaddieRecording() {
  const { profile } = useAuth()
  const [recordings, setRecordings] = useState<ShiftRecording[]>([])
  const [recentShifts, setRecentShifts] = useState<Shift[]>([])
  const [selectedShift, setSelectedShift] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!profile) return
    Promise.all([
      api.getShiftRecordings({ baddie_id: profile.id }),
      api.getShifts({ baddie_id: profile.id, status: 'completed' }),
    ]).then(([r, s]) => {
      setRecordings(r)
      setRecentShifts(s.slice(0, 20))
    })
  }, [profile])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile || !selectedShift) return
    setUploading(true)
    const result = await api.uploadShiftRecording(selectedShift, profile.id, file)
    if (result) {
      const refreshed = await api.getShiftRecordings({ baddie_id: profile.id })
      setRecordings(refreshed)
      setSelectedShift('')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDownload = async (filePath: string) => {
    const url = await api.getRecordingUrl(filePath)
    if (url) window.open(url, '_blank')
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-1">Shift Recordings</h1>
      <p className="text-muted text-sm mb-8">Upload your shift recordings for safety and quality assurance.</p>

      <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-warm-white mb-4">Upload Recording</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-warm-white col-span-1"
          >
            <option value="">Select completed shift...</option>
            {recentShifts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.scheduled_date} — {s.start_time}–{s.end_time}
                {s.client ? ` (${s.client.first_name})` : ''}
              </option>
            ))}
          </select>

          <div className="col-span-1">
            <input
              ref={fileRef}
              type="file"
              accept="audio/*,video/*"
              onChange={handleUpload}
              disabled={!selectedShift || uploading}
              className="hidden"
              id="recording-upload"
            />
            <label
              htmlFor="recording-upload"
              className={`flex items-center justify-center gap-2 h-full px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                !selectedShift || uploading
                  ? 'bg-white/5 text-soft cursor-not-allowed'
                  : 'bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'
              }`}
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {recordings.map((rec) => (
          <div key={rec.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <FileAudio className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-warm-white">
                  Shift {rec.shift_id.slice(0, 8)}...
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted">{formatSize(rec.file_size)}</span>
                  {rec.duration_seconds && (
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="w-3 h-3" />
                      {Math.floor(rec.duration_seconds / 60)}m {rec.duration_seconds % 60}s
                    </span>
                  )}
                  <span className="text-xs text-soft">
                    {new Date(rec.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDownload(rec.file_path)}
              className="text-gold hover:text-gold-light transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
        {recordings.length === 0 && (
          <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
            No recordings uploaded yet.
          </div>
        )}
      </div>
    </div>
  )
}
