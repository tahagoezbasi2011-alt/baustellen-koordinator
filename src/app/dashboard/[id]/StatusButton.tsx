'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Gewerk {
  id: string
  name: string
  status: string
  handwerker_email: string
}

export default function StatusButton({ gewerk }: { gewerk: Gewerk }) {
  const [laden, setLaden] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function statusAendern(neuerStatus: string) {
    setLaden(true)
    const updates: Record<string, unknown> = { status: neuerStatus }

    if (neuerStatus === 'in_arbeit') updates.gestartet_am = new Date().toISOString()
    if (neuerStatus === 'fertig') updates.fertig_am = new Date().toISOString()

    await supabase.from('gewerke').update(updates).eq('id', gewerk.id)

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
        Starten
      </button>
    )
  }

  if (gewerk.status === 'in_arbeit') {
    return (
      <div className="flex flex-col gap-1">
        <button
          onClick={() => statusAendern('fertig')}
          disabled={laden}
          className="text-sm bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50 whitespace-nowrap"
        >
          Fertig melden
        </button>
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
