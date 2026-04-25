'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

export default function ProjektAbschliessen({ projektId }: { projektId: string }) {
  const [laden, setLaden] = useState(false)
  const [bestaetigung, setBestaetigung] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function abschliessen() {
    setLaden(true)
    await supabase.from('projekte').update({ status: 'abgeschlossen' }).eq('id', projektId)
    router.refresh()
    setLaden(false)
    setBestaetigung(false)
  }

  if (bestaetigung) {
    return (
      <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm text-green-800 font-medium mb-2">Projekt wirklich abschließen?</p>
        <div className="flex gap-2">
          <button
            onClick={abschliessen}
            disabled={laden}
            className="flex-1 bg-green-500 text-white text-sm py-1.5 rounded-lg font-medium"
          >
            {laden ? 'Wird abgeschlossen...' : 'Ja, abschließen'}
          </button>
          <button
            onClick={() => setBestaetigung(false)}
            className="flex-1 bg-white text-gray-600 text-sm py-1.5 rounded-lg border border-gray-200"
          >
            Abbrechen
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setBestaetigung(true)}
      className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-xl transition text-sm"
    >
      <CheckCircle2 className="w-4 h-4" />
      Projekt abschließen
    </button>
  )
}
