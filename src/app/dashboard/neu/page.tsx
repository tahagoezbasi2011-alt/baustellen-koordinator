'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Calendar, User, Mail, Building2, FileText } from 'lucide-react'

const GEWERKE_VORSCHLAEGE = [
  'Erdarbeiten', 'Maurer', 'Betonbau', 'Zimmerer', 'Dachdecker',
  'Elektriker', 'Sanitär', 'Heizung', 'Isolierung', 'Trockenbau',
  'Estrich', 'Fliesenleger', 'Maler', 'Schreiner', 'Bodenbelag'
]

interface Gewerk {
  name: string
  handwerker_name: string
  handwerker_email: string
  faellig_am: string
}

export default function NeuesBaustellePage() {
  const [name, setName] = useState('')
  const [adresse, setAdresse] = useState('')
  const [beschreibung, setBeschreibung] = useState('')
  const [gewerke, setGewerke] = useState<Gewerk[]>([
    { name: '', handwerker_name: '', handwerker_email: '', faellig_am: '' }
  ])
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function gewerkHinzufuegen() {
    setGewerke([...gewerke, { name: '', handwerker_name: '', handwerker_email: '', faellig_am: '' }])
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
      faellig_am: g.faellig_am || null,
    }))

    await supabase.from('gewerke').insert(gewerkeDaten)
    router.push(`/dashboard/${projekt.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-gray-900">Neue Baustelle</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={speichern} className="space-y-4">
          {/* Basisdaten */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-orange-100 p-2 rounded-xl">
                <Building2 className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="font-bold text-gray-900">Baustellen-Infos</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name *</label>
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
                placeholder="z.B. Einfamilienhaus Musterstraße"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse</label>
              <input
                value={adresse}
                onChange={e => setAdresse(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
                placeholder="Musterstraße 1, 12345 Musterstadt"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Beschreibung</label>
              <textarea
                value={beschreibung}
                onChange={e => setBeschreibung(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 resize-none"
                placeholder="Kurze Beschreibung..."
              />
            </div>
          </div>

          {/* Gewerke */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-blue-100 p-2 rounded-xl">
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="font-bold text-gray-900">Gewerke & Reihenfolge</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4 ml-1">In welcher Reihenfolge werden die Gewerke ausgeführt?</p>

            <div className="space-y-3">
              {gewerke.map((gewerk, index) => (
                <div key={index} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-semibold text-gray-600">Gewerk {index + 1}</span>
                    {gewerke.length > 1 && (
                      <button type="button" onClick={() => gewerkEntfernen(index)} className="ml-auto text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Gewerk *</label>
                      <input
                        list={`vorschlaege-${index}`}
                        value={gewerk.name}
                        onChange={e => gewerkAktualisieren(index, 'name', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                        placeholder="z.B. Elektriker"
                      />
                      <datalist id={`vorschlaege-${index}`}>
                        {GEWERKE_VORSCHLAEGE.map(v => <option key={v} value={v} />)}
                      </datalist>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                          <User className="w-3 h-3" /> Name
                        </label>
                        <input
                          value={gewerk.handwerker_name}
                          onChange={e => gewerkAktualisieren(index, 'handwerker_name', e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                          placeholder="Max Mustermann"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                          <Mail className="w-3 h-3" /> E-Mail
                        </label>
                        <input
                          type="email"
                          value={gewerk.handwerker_email}
                          onChange={e => gewerkAktualisieren(index, 'handwerker_email', e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                          placeholder="email@firma.de"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                        <Calendar className="w-3 h-3" /> Geplantes Datum (optional)
                      </label>
                      <input
                        type="date"
                        value={gewerk.faellig_am}
                        onChange={e => gewerkAktualisieren(index, 'faellig_am', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={gewerkHinzufuegen}
              className="mt-3 flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Gewerk hinzufügen
            </button>
          </div>

          {fehler && (
            <div className="bg-red-50 text-red-600 text-sm rounded-2xl px-4 py-3">{fehler}</div>
          )}

          <button
            type="submit"
            disabled={laden}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-3xl transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
          >
            {laden ? 'Wird gespeichert...' : 'Baustelle anlegen'}
          </button>
        </form>
      </main>
    </div>
  )
}
