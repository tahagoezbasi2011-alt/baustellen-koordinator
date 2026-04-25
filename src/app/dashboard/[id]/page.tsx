import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react'
import StatusButton from './StatusButton'

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

export default async function BaustelleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 truncate">{projekt.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Info Karte */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {projekt.adresse && (
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
              <MapPin className="w-4 h-4" />
              {projekt.adresse}
            </div>
          )}
          {projekt.beschreibung && (
            <p className="text-gray-600 text-sm">{projekt.beschreibung}</p>
          )}

          {/* Fortschrittsbalken */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Fortschritt</span>
              <span className="font-medium text-gray-900">{fertig}/{gesamt} Gewerke fertig</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-orange-500 h-2.5 rounded-full transition-all"
                style={{ width: `${fortschritt}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{fortschritt}%</p>
          </div>
        </div>

        {/* Gewerke Liste */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Gewerke & Status</h2>

          {!gewerke || gewerke.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-gray-200">
              Keine Gewerke eingetragen
            </div>
          ) : (
            <div className="space-y-2">
              {gewerke.map((gewerk, index) => {
                const vorgewerk = index > 0 ? gewerke[index - 1] : null
                const gesperrt = vorgewerk && vorgewerk.status !== 'fertig'

                return (
                  <div
                    key={gewerk.id}
                    className={`bg-white rounded-xl border p-4 ${
                      gesperrt ? 'border-gray-100 opacity-60' : 'border-gray-200'
                    } ${gewerk.status === 'in_arbeit' ? 'border-l-4 border-l-blue-400' : ''}
                    ${gewerk.status === 'fertig' ? 'border-l-4 border-l-green-400' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400 font-medium">#{index + 1}</span>
                          <h3 className="font-semibold text-gray-900">{gewerk.name}</h3>
                        </div>

                        {gewerk.handwerker_name && (
                          <p className="text-sm text-gray-500">{gewerk.handwerker_name}</p>
                        )}
                        {gewerk.handwerker_email && (
                          <p className="text-xs text-gray-400">{gewerk.handwerker_email}</p>
                        )}

                        <div className="mt-2">
                          <StatusBadge status={gewerk.status} />
                        </div>
                      </div>

                      {!gesperrt && (
                        <StatusButton gewerk={gewerk} />
                      )}
                    </div>

                    {gesperrt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Wartet auf: {vorgewerk?.name}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
