'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HardHat } from 'lucide-react'

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: passwort,
    })

    if (error) {
      setFehler('E-Mail oder Passwort falsch')
      setLaden(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-orange-500 p-3 rounded-2xl">
              <HardHat className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Baustellen-Koordinator</h1>
          <p className="text-gray-500 mt-1">Einloggen</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={einloggen} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="deine@email.de"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
              <input
                type="password"
                required
                value={passwort}
                onChange={e => setPasswort(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
              />
            </div>

            {fehler && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">
                {fehler}
              </div>
            )}

            <button
              type="submit"
              disabled={laden}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
            >
              {laden ? 'Einloggen...' : 'Einloggen'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-orange-500 font-medium hover:underline">
              Registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
