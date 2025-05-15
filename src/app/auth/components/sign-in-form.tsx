'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/auth-provider'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

interface SignInFormProps {
  onToggleView: () => void
}

export function SignInForm({ onToggleView }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signInWithGoogle, signInWithGithub, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn(email, password)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl border bg-card shadow-lg"
    >
      <div className="border-b p-6">
        <h2 className="text-xl font-semibold">Sign In</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Sign in to your account below.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
        
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => signInWithGithub()} 
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
          >
            <FaGithub className="h-4 w-4" />
            <span>GitHub</span>
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => signInWithGoogle()} 
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
          >
            <FcGoogle className="h-4 w-4" />
            <span>Google</span>
          </Button>
        </div>
      </form>
      <div className="p-6 pt-0 text-center">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onToggleView}
            className="text-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </motion.div>
  )
} 