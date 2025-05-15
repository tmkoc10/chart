'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/auth-provider'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

interface SignUpFormProps {
  onToggleView: () => void
}

export function SignUpForm({ onToggleView }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState({ email: '', password: '' })
  const { signUp, signInWithGoogle, signInWithGithub, isLoading } = useAuth()

  const validateForm = () => {
    let valid = true
    const errors = { email: '', password: '' }
    
    // Email validation
    if (!email) {
      errors.email = 'Email is required'
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address'
      valid = false
    }
    
    // Password validation
    if (!password) {
      errors.password = 'Password is required'
      valid = false
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
      valid = false
    }
    
    setFormErrors(errors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      await signUp(email, password)
    } catch (error) {
      console.error('Form submission error:', error)
    }
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
        <h2 className="text-xl font-semibold">Create an Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign up to get started with Algoz Tech.
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
              onChange={(e) => {
                setEmail(e.target.value)
                if (formErrors.email) setFormErrors({...formErrors, email: ''})
              }}
              required
              className={`flex h-10 w-full rounded-md border ${formErrors.email ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              placeholder="you@example.com"
            />
            {formErrors.email && (
              <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
            )}
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
              onChange={(e) => {
                setPassword(e.target.value)
                if (formErrors.password) setFormErrors({...formErrors, password: ''})
              }}
              required
              className={`flex h-10 w-full rounded-md border ${formErrors.password ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              placeholder="••••••••"
            />
            {formErrors.password ? (
              <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
        
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign up with
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
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleView}
            className="text-primary hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  )
} 