import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { gewerk_id, projekt_id } = await request.json()
    const supabase = await createClient()

    // Alle Gewerke des Projekts laden
    const { data: gewerke } = await supabase
      .from('gewerke')
      .select('*')
      .eq('projekt_id', projekt_id)
      .order('reihenfolge')

    if (!gewerke) return NextResponse.json({ ok: true })

    // Nächstes Gewerk finden
    const aktuellerIndex = gewerke.findIndex(g => g.id === gewerk_id)
    const naechstesGewerk = gewerke[aktuellerIndex + 1]

    if (!naechstesGewerk?.handwerker_email) return NextResponse.json({ ok: true })

    // Projekt laden
    const { data: projekt } = await supabase
      .from('projekte')
      .select('name, adresse')
      .eq('id', projekt_id)
      .single()

    // Email via Resend senden (falls API Key vorhanden)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Baustellen-Koordinator <noreply@baustellen-koordinator.de>',
          to: naechstesGewerk.handwerker_email,
          subject: `Sie sind dran: ${naechstesGewerk.name} auf Baustelle "${projekt?.name}"`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <div style="background: #f97316; color: white; padding: 20px; border-radius: 12px 12px 0 0;">
                <h1 style="margin: 0; font-size: 20px;">Baustellen-Koordinator</h1>
              </div>
              <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                <h2 style="color: #111827;">Sie sind dran!</h2>
                <p style="color: #6b7280;">Das vorherige Gewerk <strong>"${gewerke[aktuellerIndex].name}"</strong> wurde abgeschlossen.</p>
                <p style="color: #6b7280;">Ihr Gewerk <strong>"${naechstesGewerk.name}"</strong> kann jetzt beginnen.</p>
                ${projekt?.name ? `<p style="color: #6b7280;"><strong>Baustelle:</strong> ${projekt.name}</p>` : ''}
                ${projekt?.adresse ? `<p style="color: #6b7280;"><strong>Adresse:</strong> ${projekt.adresse}</p>` : ''}
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #9ca3af; font-size: 12px;">Baustellen-Koordinator</p>
              </div>
            </div>
          `,
        }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
