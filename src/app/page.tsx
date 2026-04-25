import Link from 'next/link'
import { HardHat, CheckCircle2, Clock, Share2, Bell, BarChart2, ArrowRight, Building2, Users, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-2xl shadow-sm">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Baustellen-Koordinator</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition">
              Einloggen
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-2xl shadow-sm shadow-orange-200 hover:shadow-md transition-all">
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4" /> Speziell für Handwerksbetriebe
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            Schluss mit dem<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Baustellen-Chaos
            </span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
            Koordiniere alle Gewerke auf deiner Baustelle digital. Wer macht was, wann und in welcher Reihenfolge — alles auf einen Blick.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-8 py-4 rounded-3xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:scale-105 transition-all"
            >
              Kostenlos ausprobieren <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-3xl border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-all"
            >
              Einloggen
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">Kein Abo nötig · Sofort loslegen</p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-10">Kennst du das?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { emoji: '📞', text: 'Der Elektriker wartet auf den Maurer — und niemand wurde informiert' },
              { emoji: '📋', text: 'Excel-Listen und WhatsApp-Gruppen — nichts ist dokumentiert' },
              { emoji: '😤', text: 'Der Kunde fragt ständig nach dem Stand — du hast keinen Überblick' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-3xl p-5">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">So funktioniert es</h2>
            <p className="text-gray-500">Einfach, schnell, ohne Schulung</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <Building2 className="w-6 h-6 text-orange-500" />,
                bg: 'bg-orange-100',
                title: 'Baustelle anlegen',
                desc: 'Projekt erstellen, Gewerke in der richtigen Reihenfolge eintragen — fertig in 2 Minuten.',
              },
              {
                icon: <Clock className="w-6 h-6 text-blue-500" />,
                bg: 'bg-blue-100',
                title: 'Status in Echtzeit',
                desc: 'Jeder Handwerker meldet seinen Status. Das nächste Gewerk wird automatisch benachrichtigt.',
              },
              {
                icon: <Share2 className="w-6 h-6 text-purple-500" />,
                bg: 'bg-purple-100',
                title: 'Kunden informieren',
                desc: 'Teile einen Link mit dem Bauherrn. Er sieht den Fortschritt — ohne Login, ohne App.',
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
                bg: 'bg-green-100',
                title: 'Alles dokumentiert',
                desc: 'Wer hat wann was gemacht — mit Zeitstempel und Notizen. Perfekt bei Streitigkeiten.',
              },
              {
                icon: <Bell className="w-6 h-6 text-amber-500" />,
                bg: 'bg-amber-100',
                title: 'Automatische Benachrichtigungen',
                desc: 'Handwerker bekommt eine E-Mail sobald er dran ist. Kein manuelles Anrufen mehr.',
              },
              {
                icon: <BarChart2 className="w-6 h-6 text-red-500" />,
                bg: 'bg-red-100',
                title: 'Fortschritt auf einen Blick',
                desc: 'Dashboard zeigt alle Baustellen mit Fortschrittsbalken. Immer den Überblick behalten.',
              },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className={`${f.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Für wen */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Perfekt für</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { emoji: '⚡', label: 'Elektriker' },
              { emoji: '🔧', label: 'Sanitär' },
              { emoji: '🔨', label: 'Maurer' },
              { emoji: '🏠', label: 'Dachdecker' },
              { emoji: '🎨', label: 'Maler' },
              { emoji: '🪵', label: 'Zimmerer' },
              { emoji: '🧱', label: 'Fliesenleger' },
              { emoji: '📐', label: 'Bauleiter' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center border border-orange-100 shadow-sm">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <p className="text-sm font-semibold text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-10 shadow-2xl shadow-orange-200">
            <HardHat className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-3">Bereit loszulegen?</h2>
            <p className="text-orange-100 mb-6">Kostenlos starten — keine Kreditkarte nötig</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-2xl hover:shadow-lg transition-all"
            >
              Jetzt kostenlos registrieren <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-orange-500 p-1 rounded-lg">
            <HardHat className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-gray-600">Baustellen-Koordinator</span>
        </div>
        <p>Gemacht für Handwerker · Von einem Handwerker</p>
      </footer>
    </div>
  )
}
