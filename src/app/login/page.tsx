'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HardHat, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [fehler, setFehler] = useState('')
  const [laden, setLaden] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function einloggen(e: React.FormEvent) {
    e.preventDefault()
    setLaden(true)
    setFehler('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: passwort })
    if (error) {
      setFehler('E-Mail oder Passwort falsch')
      setLaden(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-lg shadow-orange-200 mb-4">
            <HardHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Willkommen zurück</h1>
          <p className="text-gray-500 text-sm mt-1">Baustellen-Koordinator</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-6 border border-gray-100">
          <form onSubmit={einloggen} className="space-y-4">
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
                  value={passwort}
                  onChange={e => setPasswort(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 text-sm"
                  placeholder="••••••••"
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
              {laden ? 'Einloggen...' : <>Einloggen <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-orange-500 font-semibold hover:text-orange-600">
              Registrieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
