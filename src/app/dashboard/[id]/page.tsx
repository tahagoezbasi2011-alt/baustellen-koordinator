import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, CheckCircle2, Circle, Clock,
  Pencil, Calendar, StickyNote, User, Mail, Building2
} from 'lucide-react'
import StatusButton from './StatusButton'
import ShareButton from './ShareButton'
import ProjektAbschliessen from './ProjektAbschliessen'

function StatusBadge({ status }: { status: string }) {
  if (status === 'fertig') return (
    <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
      <CheckCircle2 className="w-3.5 h-3.5" /> Fertig
    </span>
  )
  if (status === 'in_arbeit') return (
    <span className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full">
      <Clock className="w-3.5 h-3.5" /> In Arbeit
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 text-gray-400 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full">
      <Circle className="w-3.5 h-3.5" /> Ausstehend
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

export default async function BaustelleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projekt } = await supabase
    .from('projekte').select('*').eq('id', id).single()

  if (!projekt) notFound()

  const { data: gewerke } = await supabase
    .from('gewerke').select('*').eq('projekt_id', id).order('reihenfolge')

  const fertig = gewerke?.filter(g => g.status === 'fertig').length ?? 0
  const gesamt = gewerke?.length ?? 0
  const fortschritt = gesamt > 0 ? Math.round((fertig / gesamt) * 100) : 0
  const istAbgeschlossen = projekt.status === 'abgeschlossen'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 truncate">{projekt.name}</h1>
          </div>
          <div className="flex items-center gap-1">
            <ShareButton projektId={id} projektName={projekt.name} />
            {!istAbgeschlossen && (
              <Link href={`/dashboard/${id}/bearbeiten`} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition">
                <Pencil className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Info Karte */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2.5 rounded-2xl">
                <Building2 className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                {projekt.adresse && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin className="w-3.5 h-3.5" /> {projekt.adresse}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
                  <Calendar className="w-3 h-3" /> {formatDatum(projekt.erstellt_am)}
                </div>
              </div>
            </div>
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
              istAbgeschlossen ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'
            }`}>
              {istAbgeschlossen ? '✓ Abgeschlossen' : '● Aktiv'}
            </span>
          </div>

          {projekt.beschreibung && (
            <p className="text-gray-500 text-sm mb-4 pl-1">{projekt.beschreibung}</p>
          )}

          {/* Fortschrittsbalken */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 font-medium">Fortschritt</span>
              <span className="font-bold text-gray-900">{fertig}/{gesamt} Gewerke</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${fortschritt}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1.5 font-medium">{fortschritt}%</p>
          </div>

          {!istAbgeschlossen && fertig === gesamt && gesamt > 0 && (
            <ProjektAbschliessen projektId={id} />
          )}
        </div>

        {/* Gewerke */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Gewerke & Status</h2>

          {!gewerke || gewerke.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white rounded-3xl border border-gray-100">
              Keine Gewerke eingetragen
            </div>
          ) : (
            <div className="space-y-3">
              {gewerke.map((gewerk, index) => {
                const vorgewerk = index > 0 ? gewerke[index - 1] : null
                const gesperrt = vorgewerk && vorgewerk.status !== 'fertig'

                return (
                  <div
                    key={gewerk.id}
                    className={`bg-white rounded-3xl border p-5 transition-all shadow-sm ${
                      gesperrt ? 'border-gray-100 opacity-50' :
                      gewerk.status === 'in_arbeit' ? 'border-blue-200 shadow-blue-50' :
                      gewerk.status === 'fertig' ? 'border-green-200' :
                      'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Nummer & Status Icon */}
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                          gewerk.status === 'fertig' ? 'bg-green-100 text-green-600' :
                          gewerk.status === 'in_arbeit' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {gewerk.status === 'fertig' ? <CheckCircle2 className="w-4 h-4" /> :
                           gewerk.status === 'in_arbeit' ? <Clock className="w-4 h-4" /> :
                           index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900">{gewerk.name}</h3>

                          {(gewerk.handwerker_name || gewerk.handwerker_email) && (
                            <div className="mt-1 space-y-0.5">
                              {gewerk.handwerker_name && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <User className="w-3 h-3" /> {gewerk.handwerker_name}
                                </div>
                              )}
                              {gewerk.handwerker_email && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                  <Mail className="w-3 h-3" /> {gewerk.handwerker_email}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="mt-2">
                            <StatusBadge status={gewerk.status} />
                          </div>

                          {/* Zeitstempel */}
                          <div className="mt-2 space-y-0.5">
                            {gewerk.gestartet_am && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Gestartet: {formatDatum(gewerk.gestartet_am)}
                              </p>
                            )}
                            {gewerk.fertig_am && (
                              <p className="text-xs text-green-500 flex items-center gap-1 font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Fertig: {formatDatum(gewerk.fertig_am)}
                              </p>
                            )}
                          </div>

                          {/* Notizen */}
                          {gewerk.notizen && (
                            <div className="mt-2.5 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-2xl px-3 py-2">
                              <StickyNote className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-600">{gewerk.notizen}</p>
                            </div>
                          )}

                          {gesperrt && (
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Wartet auf: {vorgewerk?.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {!gesperrt && !istAbgeschlossen && (
                        <StatusButton gewerk={{ ...gewerk, projekt_id: id }} />
                      )}
                    </div>
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
