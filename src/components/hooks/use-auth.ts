'use client'

import { useSession } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const user = session?.user || null
  const isLoading = status === 'loading'
  const isAuthenticated = !!user

  const isAdmin = user?.role === 'ADMIN'
  const isDesigner = user?.role === 'DESIGNER' || user?.role === 'ADMIN'
  const isGuest = user?.role === 'GUEST'

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    isAdmin,
    isDesigner,
    isGuest,
  }
}
