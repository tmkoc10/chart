'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/auth-provider'

export default function DashboardPage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="border-b bg-card px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-lg font-semibold">Algoz Tech Dashboard</h1>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Welcome to your dashboard!</h2>
            <p className="text-muted-foreground">
              You are logged in as: <span className="font-medium text-foreground">{user.email}</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 