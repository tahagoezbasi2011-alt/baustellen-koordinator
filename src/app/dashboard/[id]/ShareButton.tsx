'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

export default function ShareButton({ projektId, projektName }: { projektId: string, projektName: string }) {
  const [kopiert, setKopiert] = useState(false)

  async function teilen() {
    const url = `${window.location.origin}/p/${projektId}`
    await navigator.clipboard.writeText(url)
    setKopiert(true)
    setTimeout(() => setKopiert(false), 2000)
  }

  return (
    <button
      onClick={teilen}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition"
      title="Link kopieren"
    >
      {kopiert ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
      {kopiert ? 'Kopiert!' : 'Teilen'}
    </button>
  )
}
