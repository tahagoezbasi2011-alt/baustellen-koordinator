import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HardHat, Plus, MapPin, ChevronRight, LogOut } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projekte } = await supabase
    .from('projekte')
    .select('*, gewerke(count)')
    .order('erstellt_am', { ascending: false })

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
              Abmelden
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Begrüßung */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meine Baustellen</h1>
          <p className="text-gray-500 text-sm mt-1">
            {user.user_metadata?.name ? `Hallo, ${user.user_metadata.name}!` : `Hallo!`}
          </p>
        </div>

        {/* Neue Baustelle Button */}
        <Link
          href="/dashboard/neu"
          className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl mb-6 transition"
        >
          <Plus className="w-5 h-5" />
          Neue Baustelle anlegen
        </Link>

        {/* Projektliste */}
        {!projekte || projekte.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <HardHat className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Noch keine Baustellen</p>
            <p className="text-sm">Leg deine erste Baustelle an!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projekte.map((projekt) => (
              <Link
                key={projekt.id}
                href={`/dashboard/${projekt.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-300 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        projekt.status === 'aktiv'
                          ? 'bg-green-100 text-green-700'
                          : projekt.status === 'abgeschlossen'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {projekt.status === 'aktiv' ? 'Aktiv' : projekt.status === 'abgeschlossen' ? 'Abgeschlossen' : projekt.status}
                      </span>
                    </div>
                    <h2 className="font-semibold text-gray-900 truncate">{projekt.name}</h2>
                    {projekt.adresse && (
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{projekt.adresse}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
