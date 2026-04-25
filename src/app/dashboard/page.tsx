import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  HardHat, Plus, MapPin, ChevronRight, LogOut,
  CheckCircle2, Clock, Briefcase, TrendingUp, Building2
} from 'lucide-react'
import Suche from './Suche'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projekte } = await supabase
    .from('projekte')
    .select('*')
    .order('erstellt_am', { ascending: false })

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
  const gesamtFertig = alleGewerke?.filter(g => g.status === 'fertig').length ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-2xl shadow-sm shadow-orange-200">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Baustellen-Koordinator</span>
          </div>
          <form action="/auth/logout" method="post">
            <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition p-2 rounded-xl hover:bg-gray-100">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Begrüßung */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Hallo{user.user_metadata?.name ? `, ${user.user_metadata.name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-400 text-sm">Hier ist deine Übersicht</p>
        </div>

        {/* Statistik-Karten */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-3xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 rounded-2xl mb-2">
              <Building2 className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{aktive}</div>
            <div className="text-xs text-gray-400 mt-0.5">Aktiv</div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-2xl mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{abgeschlossene}</div>
            <div className="text-xs text-gray-400 mt-0.5">Fertig</div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-2xl mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{gesamtFertig}</div>
            <div className="text-xs text-gray-400 mt-0.5">Gewerke</div>
          </div>
        </div>

        {/* Suche */}
        {projekte && projekte.length > 0 && (
          <Suche projekte={projekte} />
        )}

        {/* Neue Baustelle */}
        <Link
          href="/dashboard/neu"
          className="flex items-center justify-center gap-2.5 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-3xl transition-all shadow-lg shadow-orange-200"
        >
          <Plus className="w-5 h-5" />
          Neue Baustelle anlegen
        </Link>

        {/* Aktive Projekte */}
        {projekte && projekte.filter(p => p.status === 'aktiv').length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Aktive Baustellen</h2>
            <div className="space-y-3">
              {projekte.filter(p => p.status === 'aktiv').map((projekt) => {
                const stats = getStats(projekt.id)
                return (
                  <Link
                    key={projekt.id}
                    href={`/dashboard/${projekt.id}`}
                    className="block bg-white rounded-3xl border border-gray-100 p-5 hover:shadow-md hover:border-orange-100 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-100 p-2.5 rounded-2xl mt-0.5">
                          <Building2 className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{projekt.name}</h3>
                          {projekt.adresse && (
                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span>{projekt.adresse}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 mt-1" />
                    </div>

                    {stats.gesamt > 0 && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {stats.fertig}/{stats.gesamt} Gewerke
                          </span>
                          <span className="font-semibold text-gray-600">{stats.fortschritt}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${stats.fortschritt}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {stats.inArbeit > 0 && (
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-blue-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {stats.inArbeit} Gewerk gerade in Arbeit
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
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Abgeschlossen</h2>
            <div className="space-y-2">
              {projekte.filter(p => p.status === 'abgeschlossen').map((projekt) => (
                <Link
                  key={projekt.id}
                  href={`/dashboard/${projekt.id}`}
                  className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 transition opacity-60 hover:opacity-80 shadow-sm"
                >
                  <div className="bg-green-100 p-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-600">{projekt.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {(!projekte || projekte.length === 0) && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-3xl mb-4">
              <HardHat className="w-10 h-10 text-orange-400" />
            </div>
            <p className="font-bold text-gray-700 text-lg">Noch keine Baustellen</p>
            <p className="text-gray-400 text-sm mt-1">Leg deine erste Baustelle an!</p>
          </div>
        )}
      </main>
    </div>
  )
}
