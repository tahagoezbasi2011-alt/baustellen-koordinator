import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HardHat, Plus, MapPin, ChevronRight, LogOut, CheckCircle2, Clock, Circle, BarChart2 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projekte } = await supabase
    .from('projekte')
    .select('*')
    .order('erstellt_am', { ascending: false })

  // Gewerke-Stats für jedes Projekt laden
  const { data: alleGewerke } = await supabase
    .from('gewerke')
    .select('projekt_id, status')

  function getStats(projektId: string) {
    const gewerke = alleGewerke?.filter(g => g.projekt_id === projektId) ?? []
    const gesamt = gewerke.length
    const fertig = gewerke.filter(g => g.status === 'fertig').length
    const inArbeit = gewerke.filter(g => g.status === 'in_arbeit').length
    const fortschritt = gesamt > 0 ? Math.round((fertig / gesamt) * 100) : 0
    return { gesamt, fertig, inArbeit, fortschritt }
  }

  const aktive = projekte?.filter(p => p.status === 'aktiv').length ?? 0
  const abgeschlossene = projekte?.filter(p => p.status === 'abgeschlossen').length ?? 0
  const gesamtGewerke = alleGewerke?.filter(g => g.status === 'fertig').length ?? 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Baustellen-Koordinator</span>
          </div>
          <form action="/auth/logout" method="post">
            <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Begrüßung */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">
            Hallo{user.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
          </h1>
          <p className="text-gray-500 text-sm">Hier ist deine Übersicht</p>
        </div>

        {/* Statistiken */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-orange-500">{aktive}</div>
            <div className="text-xs text-gray-500 mt-0.5">Aktiv</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-green-500">{abgeschlossene}</div>
            <div className="text-xs text-gray-500 mt-0.5">Abgeschlossen</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-blue-500">{gesamtGewerke}</div>
            <div className="text-xs text-gray-500 mt-0.5">Gewerke fertig</div>
          </div>
        </div>

        {/* Neue Baustelle Button */}
        <Link
          href="/dashboard/neu"
          className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl mb-5 transition"
        >
          <Plus className="w-5 h-5" />
          Neue Baustelle anlegen
        </Link>

        {/* Aktive Projekte */}
        {projekte && projekte.filter(p => p.status === 'aktiv').length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Aktive Baustellen</h2>
            <div className="space-y-3">
              {projekte.filter(p => p.status === 'aktiv').map((projekt) => {
                const stats = getStats(projekt.id)
                return (
                  <Link
                    key={projekt.id}
                    href={`/dashboard/${projekt.id}`}
                    className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-300 hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{projekt.name}</h3>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>

                    {projekt.adresse && (
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{projekt.adresse}</span>
                      </div>
                    )}

                    {stats.gesamt > 0 && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{stats.fertig}/{stats.gesamt} Gewerke</span>
                          <span>{stats.fortschritt}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-orange-400 h-1.5 rounded-full"
                            style={{ width: `${stats.fortschritt}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {stats.inArbeit > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-blue-500">
                        <Clock className="w-3 h-3" />
                        {stats.inArbeit} Gewerk in Arbeit
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Abgeschlossene Projekte */}
        {projekte && projekte.filter(p => p.status === 'abgeschlossen').length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Abgeschlossen</h2>
            <div className="space-y-2">
              {projekte.filter(p => p.status === 'abgeschlossen').map((projekt) => (
                <Link
                  key={projekt.id}
                  href={`/dashboard/${projekt.id}`}
                  className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 hover:border-gray-200 transition opacity-70"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="flex-1 text-sm text-gray-600 truncate">{projekt.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Leer-Zustand */}
        {(!projekte || projekte.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <HardHat className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Noch keine Baustellen</p>
            <p className="text-sm">Leg deine erste Baustelle an!</p>
          </div>
        )}
      </main>
    </div>
  )
}
