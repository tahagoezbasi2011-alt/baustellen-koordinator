'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HardHat, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [fehler, setFehler] = useState('')
  const [laden, setLaden] = useState(false)
  const [erfolg, setErfolg] = useState(false)
  const supabase = createClient()

  async function registrieren(e: React.FormEvent) {
    e.preventDefault()
    setLaden(true)
    setFehler('')
    const { error } = await supabase.auth.signUp({
      email,
      password: passwort,
      options: { data: { name } },
    })
    if (error) {
      setFehler(error.message)
      setLaden(false)
    } else {
      setErfolg(true)
      setLaden(false)
    }
  }

  if (erfolg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-3xl mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Fast fertig!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Wir haben dir eine Bestätigungs-E-Mail geschickt. Klick auf den Link darin, dann kannst du dich einloggen.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600">
              Zum Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-lg shadow-orange-200 mb-4">
            <HardHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Konto erstellen</h1>
          <p className="text-gray-500 text-sm mt-1">Baustellen-Koordinator</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-6 border border-gray-100">
          <form onSubmit={registrieren} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 text-sm"
                  placeholder="Max Mustermann"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 text-sm"
                  placeholder="deine@email.de"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwort}
                  onChange={e => setPasswort(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 text-sm"
                  placeholder="Mindestens 6 Zeichen"
                />
              </div>
            </div>

            {fehler && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-2xl px-4 py-3">
                <span>⚠️</span> {fehler}
              </div>
            )}

            <button
              type="submit"
              disabled={laden}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-2xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {laden ? 'Wird erstellt...' : <>Konto erstellen <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
            Schon ein Konto?{' '}
            <Link href="/login" className="text-orange-500 font-semibold hover:text-orange-600">
              Einloggen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
