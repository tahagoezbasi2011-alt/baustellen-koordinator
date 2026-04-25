'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Building2, ChevronRight, X } from 'lucide-react'

interface Projekt {
  id: string
  name: string
  adresse: string | null
  status: string
}

export default function Suche({ projekte }: { projekte: Projekt[] }) {
  const [suche, setSuche] = useState('')

  const gefunden = suche.trim().length > 0
    ? projekte.filter(p =>
        p.name.toLowerCase().includes(suche.toLowerCase()) ||
        p.adresse?.toLowerCase().includes(suche.toLowerCase())
      )
    : []

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={suche}
          onChange={e => setSuche(e.target.value)}
          placeholder="Baustelle suchen..."
          className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
        />
        {suche && (
          <button
            onClick={() => setSuche('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {suche.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden">
          {gefunden.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              Keine Baustelle gefunden
            </div>
          ) : (
            <div>
              {gefunden.map((projekt) => (
                <Link
                  key={projekt.id}
                  href={`/dashboard/${projekt.id}`}
                  onClick={() => setSuche('')}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition border-b border-gray-50 last:border-0"
                >
                  <div className="bg-orange-100 p-2 rounded-xl">
                    <Building2 className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{projekt.name}</p>
                    {projekt.adresse && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3" /> {projekt.adresse}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
