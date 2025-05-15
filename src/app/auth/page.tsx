'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { SignInForm } from './components/sign-in-form'
import { SignUpForm } from './components/sign-up-form'
import { useNotification } from '@/components/providers/notification-provider'
import { supabase } from '@/lib/supabase'

function AuthPageContent() {
  const [activeView, setActiveView] = useState<'signin' | 'signup'>('signin')
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')
  const provider = searchParams.get('provider')
  const { showNotification } = useNotification()
  const router = useRouter()
  const hasRedirected = useRef(false)
  const hasHandledProvider = useRef(false)
  
  // Handle email verification notification
  useEffect(() => {
    if (verified === 'true') {
      showNotification('success', 'Email verified successfully! You can now sign in.', 5000)
    }
  }, [verified, showNotification])

  // Handle OAuth callbacks - only run once when component mounts if provider param exists
  useEffect(() => {
    // Only run this effect if we have a provider parameter and haven't handled it yet
    if (!provider || hasHandledProvider.current) return;
    
    // Mark as handled to prevent infinite loop
    hasHandledProvider.current = true;
    
    const checkSession = async () => {
      // Prevent multiple redirect attempts
      if (hasRedirected.current) return;

      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error checking session:', error)
          return
        }
        
        // Only redirect if we have a valid session AND a user
        if (data?.session && data.session.user) {
          console.log('User authenticated:', data.session.user.email)
          
          const providerName = provider === 'github' ? 'GitHub' : 'Google'
          showNotification('success', `Signed in with ${providerName} successfully!`, 3000)
          
          // Set redirect flag to prevent multiple redirects
          hasRedirected.current = true
          
          // Give the notification a chance to show before redirecting
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          console.log('No valid session found after provider callback')
        }
      } catch (err) {
        console.error('Error in OAuth callback handling:', err)
      }
    }
    
    // Check session when provider param is present
    checkSession()
    
  }, [provider, router, showNotification]) // Run only when these dependencies change

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {activeView === 'signin' ? (
            <SignInForm key="signin" onToggleView={() => setActiveView('signup')} />
          ) : (
            <SignUpForm key="signup" onToggleView={() => setActiveView('signin')} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center p-4">Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  )
} 