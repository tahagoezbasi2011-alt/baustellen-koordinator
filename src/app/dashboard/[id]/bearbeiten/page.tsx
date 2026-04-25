import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import BearbeitenForm from './BearbeitenForm'

export const dynamic = 'force-dynamic'

export default async function BearbeitenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projekt } = await supabase
    .from('projekte')
    .select('*')
    .eq('id', id)
    .single()

  if (!projekt) notFound()

  const { data: gewerke } = await supabase
    .from('gewerke')
    .select('*')
    .eq('projekt_id', id)
    .order('reihenfolge')

  return <BearbeitenForm projekt={projekt} gewerke={gewerke ?? []} />
}
