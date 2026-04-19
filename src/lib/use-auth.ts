'use client'

import { useSession } from '@/lib/auth-client'
import type { User } from '@/types'

export function useAuth() {
  const { data: session, isPending } = useSession()
  const user = session?.user as User | undefined
  return { user, isPending, session }
}
