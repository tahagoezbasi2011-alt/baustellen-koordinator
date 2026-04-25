import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MapPin, CheckCircle2, Circle, Clock, HardHat, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

function StatusBadge({ status }: { status: string }) {
  if (status === 'fertig') return (
    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
      <CheckCircle2 className="w-4 h-4" /> Fertig
    </span>
  )
  if (status === 'in_arbeit') return (
    <span className="flex items-center gap-1 text-blue-600 text-sm font-medium">
      <Clock className="w-4 h-4" /> In Arbeit
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-gray-400 text-sm">
      <Circle className="w-4 h-4" /> Ausstehend
    </span>
  )
}

function formatDatum(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default async function PublicProjektPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: projekt } = await supabase
    .from('projekte')
    .select('*')
    .eq('id', id)
    .single()

  if (!projekt) notFound()

  const { data: gewerke } = await supabase
    .from('gewerke')
    .select('*')
    .eq('projekt_id', id)
    .order('reihenfolge')

  const fertig = gewerke?.filter(g => g.status === 'fertig').length ?? 0
  const gesamt = gewerke?.length ?? 0
  const fortschritt = gesamt > 0 ? Math.round((fertig / gesamt) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-500 text-white">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2 mb-1">
            <HardHat className="w-5 h-5" />
            <span className="text-sm font-medium opacity-80">Baustellen-Koordinator</span>
          </div>
          <h1 className="text-2xl font-bold">{projekt.name}</h1>
          {projekt.adresse && (
            <div className="flex items-center gap-1.5 mt-1 opacity-80 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {projekt.adresse}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Fortschritt */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500 font-medium">Gesamtfortschritt</span>
            <span className="font-bold text-gray-900">{fortschritt}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all"
              style={{ width: `${fortschritt}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{fertig} von {gesamt} Gewerken abgeschlossen</p>

          {projekt.beschreibung && (
            <p className="text-gray-600 text-sm mt-3 pt-3 border-t border-gray-100">{projekt.beschreibung}</p>
          )}
        </div>

        {/* Gewerke */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Bauablauf</h2>
          <div className="space-y-2">
            {gewerke?.map((gewerk, index) => (
              <div
                key={gewerk.id}
                className={`bg-white rounded-xl border p-4 ${
                  gewerk.status === 'in_arbeit' ? 'border-l-4 border-l-blue-400 border-gray-200' :
                  gewerk.status === 'fertig' ? 'border-l-4 border-l-green-400 border-gray-200' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                      <h3 className="font-semibold text-gray-900">{gewerk.name}</h3>
                    </div>
                    {gewerk.handwerker_name && (
                      <p className="text-sm text-gray-500">{gewerk.handwerker_name}</p>
                    )}
                    <div className="mt-2">
                      <StatusBadge status={gewerk.status} />
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {gewerk.gestartet_am && (
                        <p className="text-xs text-gray-400">Gestartet: {formatDatum(gewerk.gestartet_am)}</p>
                      )}
                      {gewerk.fertig_am && (
                        <p className="text-xs text-green-500">Fertig: {formatDatum(gewerk.fertig_am)}</p>
                      )}
                    </div>
                    {gewerk.notizen && (
                      <div className="mt-2 bg-yellow-50 rounded-lg px-2.5 py-1.5 text-xs text-gray-600">
                        {gewerk.notizen}
                      </div>
                    )}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    gewerk.status === 'fertig' ? 'bg-green-100' :
                    gewerk.status === 'in_arbeit' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {gewerk.status === 'fertig' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                     gewerk.status === 'in_arbeit' ? <Clock className="w-5 h-5 text-blue-500" /> :
                     <Circle className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Live-Ansicht · Zuletzt aktualisiert: {new Date().toLocaleTimeString('de-DE')}
        </p>
      </main>
    </div>
  )
}
