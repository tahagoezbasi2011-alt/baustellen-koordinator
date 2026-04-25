'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react'

const GEWERKE_VORSCHLAEGE = [
  'Erdarbeiten', 'Maurer', 'Betonbau', 'Zimmerer', 'Dachdecker',
  'Elektriker', 'Sanitär', 'Heizung', 'Isolierung', 'Trockenbau',
  'Estrich', 'Fliesenleger', 'Maler', 'Schreiner', 'Bodenbelag'
]

interface Gewerk {
  name: string
  handwerker_name: string
  handwerker_email: string
}

export default function NeuesBaustellePage() {
  const [name, setName] = useState('')
  const [adresse, setAdresse] = useState('')
  const [beschreibung, setBeschreibung] = useState('')
  const [gewerke, setGewerke] = useState<Gewerk[]>([
    { name: '', handwerker_name: '', handwerker_email: '' }
  ])
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function gewerkHinzufuegen() {
    setGewerke([...gewerke, { name: '', handwerker_name: '', handwerker_email: '' }])
  }

  function gewerkEntfernen(index: number) {
    setGewerke(gewerke.filter((_, i) => i !== index))
  }

  function gewerkAktualisieren(index: number, field: keyof Gewerk, value: string) {
    const neu = [...gewerke]
    neu[index][field] = value
    setGewerke(neu)
  }

  async function speichern(e: React.FormEvent) {
    e.preventDefault()
    if (gewerke.some(g => !g.name.trim())) {
      setFehler('Alle Gewerke brauchen einen Namen')
      return
    }
    setLaden(true)
    setFehler('')

    const { data: { user } } = await supabase.auth.getUser()

    const { data: projekt, error: projektFehler } = await supabase
      .from('projekte')
      .insert({ name, adresse, beschreibung, erstellt_von: user?.id })
      .select()
      .single()

    if (projektFehler || !projekt) {
      setFehler('Fehler beim Speichern')
      setLaden(false)
      return
    }

    const gewerkeDaten = gewerke.map((g, i) => ({
      projekt_id: projekt.id,
      name: g.name,
      reihenfolge: i + 1,
      handwerker_name: g.handwerker_name,
      handwerker_email: g.handwerker_email,
    }))

    await supabase.from('gewerke').insert(gewerkeDaten)

    router.push(`/dashboard/${projekt.id}`)
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-gray-900">Neue Baustelle</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={speichern} className="space-y-6">
          {/* Basisdaten */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h2 className="font-semibold text-gray-900">Baustellen-Infos</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="z.B. Einfamilienhaus Musterstraße"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                value={adresse}
                onChange={e => setAdresse(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Musterstraße 1, 12345 Musterstadt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
              <textarea
                value={beschreibung}
                onChange={e => setBeschreibung(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Kurze Beschreibung des Projekts..."
              />
            </div>
          </div>

          {/* Gewerke */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-1">Gewerke & Reihenfolge</h2>
            <p className="text-sm text-gray-500 mb-4">In welcher Reihenfolge werden die Gewerke ausgeführt?</p>

            <div className="space-y-4">
              {gewerke.map((gewerk, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Gewerk {index + 1}</span>
                    {gewerke.length > 1 && (
                      <button
                        type="button"
                        onClick={() => gewerkEntfernen(index)}
                        className="ml-auto text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Gewerk *</label>
                      <input
                        list={`vorschlaege-${index}`}
                        value={gewerk.name}
                        onChange={e => gewerkAktualisieren(index, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="z.B. Elektriker"
                      />
                      <datalist id={`vorschlaege-${index}`}>
                        {GEWERKE_VORSCHLAEGE.map(v => <option key={v} value={v} />)}
                      </datalist>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Handwerker Name</label>
                        <input
                          value={gewerk.handwerker_name}
                          onChange={e => gewerkAktualisieren(index, 'handwerker_name', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Max Mustermann"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">E-Mail</label>
                        <input
                          type="email"
                          value={gewerk.handwerker_email}
                          onChange={e => gewerkAktualisieren(index, 'handwerker_email', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="email@firma.de"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={gewerkHinzufuegen}
              className="mt-3 flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Gewerk hinzufügen
            </button>
          </div>

          {fehler && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">
              {fehler}
            </div>
          )}

          <button
            type="submit"
            disabled={laden}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
          >
            {laden ? 'Wird gespeichert...' : 'Baustelle anlegen'}
          </button>
        </form>
      </main>
    </div>
  )
}
