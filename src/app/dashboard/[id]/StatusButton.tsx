'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Gewerk {
  id: string
  name: string
  status: string
  handwerker_email: string
  projekt_id: string
}

export default function StatusButton({ gewerk }: { gewerk: Gewerk }) {
  const [laden, setLaden] = useState(false)
  const [notiz, setNotiz] = useState('')
  const [zeigeNotiz, setZeigeNotiz] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function statusAendern(neuerStatus: string) {
    setLaden(true)
    const updates: Record<string, unknown> = { status: neuerStatus }

    if (neuerStatus === 'in_arbeit') updates.gestartet_am = new Date().toISOString()
    if (neuerStatus === 'fertig') {
      updates.fertig_am = new Date().toISOString()
      if (notiz.trim()) updates.notizen = notiz.trim()
    }

    await supabase.from('gewerke').update(updates).eq('id', gewerk.id)

    // Email-Benachrichtigung wenn fertig
    if (neuerStatus === 'fertig') {
      await fetch('/api/benachrichtigung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gewerk_id: gewerk.id, projekt_id: gewerk.projekt_id }),
      })
    }

    setZeigeNotiz(false)
    router.refresh()
    setLaden(false)
  }

  if (gewerk.status === 'ausstehend') {
    return (
      <button
        onClick={() => statusAendern('in_arbeit')}
        disabled={laden}
        className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50 whitespace-nowrap"
      >
        {laden ? '...' : 'Starten'}
      </button>
    )
  }

  if (gewerk.status === 'in_arbeit') {
    return (
      <div className="flex flex-col gap-1.5 items-end">
        {zeigeNotiz ? (
          <div className="flex flex-col gap-1 w-48">
            <textarea
              value={notiz}
              onChange={e => setNotiz(e.target.value)}
              placeholder="Notiz (optional)..."
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 resize-none w-full focus:outline-none focus:ring-1 focus:ring-green-400"
              rows={2}
            />
            <div className="flex gap-1">
              <button
                onClick={() => statusAendern('fertig')}
                disabled={laden}
                className="flex-1 text-xs bg-green-500 text-white px-2 py-1.5 rounded-lg font-medium transition disabled:opacity-50"
              >
                {laden ? '...' : 'Fertig!'}
              </button>
              <button
                onClick={() => setZeigeNotiz(false)}
                className="text-xs text-gray-400 px-2 py-1.5 rounded-lg border border-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setZeigeNotiz(true)}
            disabled={laden}
            className="text-sm bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50 whitespace-nowrap"
          >
            Fertig melden
          </button>
        )}
        <button
          onClick={() => statusAendern('ausstehend')}
          disabled={laden}
          className="text-xs text-gray-400 hover:text-gray-600 transition"
        >
          Zurücksetzen
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => statusAendern('ausstehend')}
      disabled={laden}
      className="text-xs text-gray-400 hover:text-gray-600 transition"
    >
      Zurücksetzen
    </button>
  )
}
