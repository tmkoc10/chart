'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type NotificationType = 'success' | 'error' | 'warning'

interface NotificationProps {
  type: NotificationType
  message: string
  onClose?: () => void
  duration?: number
}

export const Notification = ({
  type,
  message,
  onClose,
  duration = 5000,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
  }[type]

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'fixed right-4 top-4 z-50 flex w-full max-w-md items-center justify-between rounded-lg border p-4 shadow-lg',
            type === 'success' && 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
            type === 'error' && 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
            type === 'warning' && 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 flex-shrink-0 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <>{children}</>
} 