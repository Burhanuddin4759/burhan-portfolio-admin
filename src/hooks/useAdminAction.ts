import { useState, useEffect, useCallback } from 'react'

export type AdminFeedback = {
  type: 'success' | 'error'
  message: string
}

export function useAdminAction() {
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null)

  useEffect(() => {
    if (feedback?.type !== 'success') return undefined
    const timer = window.setTimeout(() => setFeedback(null), 4000)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const clearFeedback = useCallback(() => setFeedback(null), [])

  const run = useCallback(async (
    action: () => Promise<void>,
    successMessage = 'Saved successfully!',
    errorMessage = 'Something went wrong. Please try again.',
  ) => {
    setSaving(true)
    setFeedback(null)
    try {
      await action()
      setFeedback({ type: 'success', message: successMessage })
    } catch {
      setFeedback({ type: 'error', message: errorMessage })
    } finally {
      setSaving(false)
    }
  }, [])

  return { saving, feedback, run, clearFeedback, setFeedback }
}
