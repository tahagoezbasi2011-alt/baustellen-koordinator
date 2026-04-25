'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'

interface Projekt {
  id: string
  name: string
  adresse: string
  beschreibung: string
}

interface Gewerk {
  id: string
  name: string
  handwerker_name: string
  handwerker_email: string
  reihenfolge: number
  status: string
}

export default function BearbeitenForm({ projekt, gewerke }: { projekt: Projekt, gewerke: Gewerk[] }) {
  const [name, setName] = useState(projekt.name)
  const [adresse, setAdresse] = useState(projekt.adresse ?? '')
  const [beschreibung, setBeschreibung] = useState(projekt.beschreibung ?? '')
  const [laden, setLaden] = useState(false)
  const [loeschenBestaetigung, setLoeschenBestaetigung] = useState(false)
  const [fehler, setFehler] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function speichern(e: React.FormEvent) {
    e.preventDefault()
    setLaden(true)
    setFehler('')

    const { error } = await supabase
      .from('projekte')
      .update({ name, adresse, beschreibung })
      .eq('id', projekt.id)

    if (error) {
      setFehler('Fehler beim Speichern')
      setLaden(false)
    } else {
      router.push(`/dashboard/${projekt.id}`)
      router.refresh()
    }
  }

  async function loeschen() {
    setLaden(true)
    await supabase.from('projekte').delete().eq('id', projekt.id)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href={`/dashboard/${projekt.id}`} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-gray-900">Baustelle bearbeiten</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <form onSubmit={speichern} className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h2 className="font-semibold text-gray-900">Basisdaten</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                value={adresse}
                onChange={e => setAdresse(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
              <textarea
                value={beschreibung}
                onChange={e => setBeschreibung(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>
          </div>

          {/* Gewerke Übersicht (readonly) */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Gewerke</h2>
            <div className="space-y-2">
              {gewerke.map((g, i) => (
                <div key={g.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400 w-5 text-center">{i + 1}</span>
                  <span className="flex-1 font-medium text-gray-800">{g.name}</span>
                  {g.handwerker_name && <span className="text-gray-400 text-xs">{g.handwerker_name}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    g.status === 'fertig' ? 'bg-green-100 text-green-700' :
                    g.status === 'in_arbeit' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {g.status === 'fertig' ? 'Fertig' : g.status === 'in_arbeit' ? 'In Arbeit' : 'Ausstehend'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {fehler && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{fehler}</div>
          )}

          <button
            type="submit"
            disabled={laden}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
          >
            {laden ? 'Wird gespeichert...' : 'Änderungen speichern'}
          </button>
        </form>

        {/* Löschen */}
        <div className="bg-white rounded-xl border border-red-100 p-4">
          <h2 className="font-semibold text-red-600 mb-2">Gefahrenzone</h2>
          {loeschenBestaetigung ? (
            <div>
              <p className="text-sm text-gray-600 mb-3">Wirklich löschen? Das kann nicht rückgängig gemacht werden!</p>
              <div className="flex gap-2">
                <button
                  onClick={loeschen}
                  disabled={laden}
                  className="flex-1 bg-red-500 text-white text-sm py-2 rounded-lg font-medium"
                >
                  Ja, löschen
                </button>
                <button
                  onClick={() => setLoeschenBestaetigung(false)}
                  className="flex-1 bg-white text-gray-600 text-sm py-2 rounded-lg border border-gray-200"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setLoeschenBestaetigung(true)}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Baustelle löschen
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
