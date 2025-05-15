'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useNotification } from './notification-provider'
import { getSiteUrl } from '@/lib/utils/site-url'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { showNotification } = useNotification()

  useEffect(() => {
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(session)
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    setData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Pre-validate email format to catch common issues
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getSiteUrl()}/auth?verified=true`,
        },
      })

      if (error) throw error

      showNotification('success', 'Account created successfully! Please check your email to verify your account.', 6000)
      router.push('/auth')
    } catch (error: unknown) {
      console.error('Sign up error:', error)

      // Handle specific errors with more user-friendly messages
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';

      if (errorMessage.includes('email')) {
        showNotification('error', 'Please enter a valid email address', 5000)
      } else if (errorMessage.includes('password')) {
        showNotification('error', 'Password must be at least 6 characters long', 5000)
      } else {
        showNotification('error', errorMessage, 5000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (!data.user?.email_confirmed_at) {
        showNotification('warning', 'Please verify your email before signing in', 5000)
        return
      }

      showNotification('success', 'Signed in successfully', 3000)
      router.push('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';

      if (errorMessage.includes('Invalid login credentials')) {
        showNotification('error', 'No account found. Please create one.', 5000)
      } else {
        showNotification('error', errorMessage, 5000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)

      // Explicitly set scopes to request email access
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getSiteUrl()}/auth?provider=google`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile'
        }
      })

      if (error) throw error

      if (!data?.url) {
        throw new Error("Failed to get authorization URL")
      }

      // We could also use a window.location.href = data.url approach instead of relying on supabase's redirect
      console.log("Redirecting to Google auth:", data.url)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      showNotification('error', errorMessage, 5000)
      setIsLoading(false)
    }
  }

  const signInWithGithub = async () => {
    try {
      setIsLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${getSiteUrl()}/auth?provider=github`,
          scopes: 'user:email'
        }
      })

      if (error) throw error

      if (!data?.url) {
        throw new Error("Failed to get authorization URL")
      }

      console.log("Redirecting to GitHub auth:", data.url)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with GitHub';
      showNotification('error', errorMessage, 5000)
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      showNotification('error', errorMessage, 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}