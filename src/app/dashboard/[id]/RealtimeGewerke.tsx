'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RealtimeGewerke({ projektId }: { projektId: string }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`gewerke-${projektId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gewerke', filter: `projekt_id=eq.${projektId}` },
        () => { router.refresh() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [projektId, router, supabase])

  return null
}
