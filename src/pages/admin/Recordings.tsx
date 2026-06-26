import { useEffect, useState } from 'react'
import { FileAudio, Download, Clock, User } from 'lucide-react'
import * as api from '../../lib/api'
import type { ShiftRecording } from '../../types'

export default function AdminRecordings() {
  const [recordings, setRecordings] = useState<ShiftRecording[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getShiftRecordings({}).then((data) => {
      setRecordings(data)
      setLoading(false)
    })
  }, [])

  const handleDownload = async (filePath: string) => {
    const url = await api.getRecordingUrl(filePath)
    if (url) window.open(url, '_blank')
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-1">Shift Recordings</h1>
      <p className="text-muted text-sm mb-8">Review uploaded shift recordings for quality and safety.</p>

      <div className="bg-charcoal/50 border border-white/5 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/5 text-xs text-soft uppercase tracking-wider font-semibold">
          <span />
          <span>Shift / Baddie</span>
          <span>Size</span>
          <span>Uploaded</span>
          <span />
        </div>

        {recordings.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">
            No recordings uploaded yet.
          </div>
        ) : (
          recordings.map((rec) => (
            <div key={rec.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
                <FileAudio className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-warm-white">
                  Shift {rec.shift_id.slice(0, 8)}...
                </p>
                <p className="text-xs text-soft flex items-center gap-1 mt-0.5">
                  <User className="w-3 h-3" />
                  Baddie {rec.baddie_id.slice(0, 8)}...
                </p>
              </div>
              <span className="text-xs text-muted">{formatSize(rec.file_size)}</span>
              <div className="text-xs text-muted text-right">
                <p>{new Date(rec.uploaded_at).toLocaleDateString()}</p>
                {rec.duration_seconds && (
                  <p className="flex items-center gap-1 justify-end text-soft mt-0.5">
                    <Clock className="w-3 h-3" />
                    {Math.floor(rec.duration_seconds / 60)}m {rec.duration_seconds % 60}s
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDownload(rec.file_path)}
                className="text-gold hover:text-gold-light transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
