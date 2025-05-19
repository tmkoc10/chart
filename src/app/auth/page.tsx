'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { useNotification } from '@/components/providers/notification-provider'
import { supabase } from '@/lib/supabase'
import { CircularProgressPage } from '@/components/magicui/circular-progress-page'
import dynamic from 'next/dynamic'

const SignInForm = dynamic(() => import('./components/sign-in-form').then(mod => mod.SignInForm), {
  loading: () => <p>Loading form...</p>,
});
const SignUpForm = dynamic(() => import('./components/sign-up-form').then(mod => mod.SignUpForm), {
  loading: () => <p>Loading form...</p>,
});

function AuthPageContent() {
  const [activeView, setActiveView] = useState<'signin' | 'signup'>('signin')
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')
  const provider = searchParams.get('provider')
  const { showNotification } = useNotification()
  const router = useRouter()
  const hasHandledProvider = useRef(false)
  
  // Handle email verification notification
  useEffect(() => {
    if (verified === 'true') {
      showNotification('success', 'Email verified successfully! You can now sign in.', 5000)
    }
  }, [verified, showNotification])

  // Handle OAuth callbacks
  useEffect(() => {
    if (!provider) {
      // If provider is not present or removed, ensure we are not in processing state from a previous attempt
      if (isProcessingOAuth) setIsProcessingOAuth(false)
      if (showProgress) setShowProgress(false) // Also hide progress if it was somehow stuck
      return
    }

    if (hasHandledProvider.current) {
      return
    }
    
    hasHandledProvider.current = true
    setShowProgress(true) // Immediately show progress for OAuth callback

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error || !data?.session?.user) {
          console.error('Error checking session or no user:', error || 'No session/user')
          setShowProgress(false) // Hide progress
          setIsProcessingOAuth(false)
          showNotification('error', 'Authentication failed. Please try again.', 5000)
          // Clear provider param to prevent re-triggering, then go to base auth page
          const newParams = new URLSearchParams(searchParams.toString())
          newParams.delete('provider')
          newParams.delete('verified') // also clear verified if any
          router.replace(`/auth?${newParams.toString()}`)
          return
        }
        
        // User is authenticated, progress page is showing.
        // Notification will show, and CircularProgressPage will redirect onComplete.
        console.log('User authenticated:', data.session.user.email)
        // showNotification('success', `Signed in with ${provider} successfully!`, 3000) // Modified to use provider directly, but kept commented
        // setIsProcessingOAuth(false) // Not strictly needed here as showProgress handles display
      } catch (err) {
        console.error('Critical error in OAuth callback handling:', err)
        setShowProgress(false) // Hide progress
        setIsProcessingOAuth(false)
        showNotification('error', 'Authentication error. Please try again.', 5000)
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.delete('provider')
        newParams.delete('verified')
        router.replace(`/auth?${newParams.toString()}`)
      }
    }
    
    checkSession()
    
  }, [provider, router, showNotification, searchParams, isProcessingOAuth, showProgress]) // Added isProcessingOAuth and showProgress

  if (showProgress) { // This now takes precedence for OAuth flow
    return <CircularProgressPage onComplete={() => router.push('/charts')} />
  }

  if (isProcessingOAuth) { // This would be for other processing states if any
    return (
      <div className="flex min-h-[100dvh] items-center justify-center p-4 bg-black">
        <p>Processing authentication, please wait...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-4 bg-black">
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
    <Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center p-4 bg-black">Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  )
} 