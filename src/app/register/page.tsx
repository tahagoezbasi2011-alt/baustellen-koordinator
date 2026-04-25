'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HardHat } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [fehler, setFehler] = useState('')
  const [laden, setLaden] = useState(false)
  const [erfolg, setErfolg] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function registrieren(e: React.FormEvent) {
    e.preventDefault()
    setLaden(true)
    setFehler('')

    const { error } = await supabase.auth.signUp({
      email,
      password: passwort,
      options: {
        data: { name },
      },
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Fast fertig!</h2>
            <p className="text-gray-600 mb-4">
              Wir haben dir eine Bestätigungs-E-Mail geschickt. Klick auf den Link darin, dann kannst du dich einloggen.
            </p>
            <Link href="/login" className="text-orange-500 font-medium hover:underline">
              Zurück zum Login
            </Link>
          </div>
        </div>
      </div>
    )
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
          <p className="text-gray-500 mt-1">Konto erstellen</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={registrieren} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Max Mustermann"
              />
            </div>

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
                minLength={6}
                value={passwort}
                onChange={e => setPasswort(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Mindestens 6 Zeichen"
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
              {laden ? 'Konto wird erstellt...' : 'Konto erstellen'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Schon ein Konto?{' '}
            <Link href="/login" className="text-orange-500 font-medium hover:underline">
              Einloggen
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
