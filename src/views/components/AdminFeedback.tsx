import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi'
import type { AdminFeedback as Feedback } from '../../hooks/useAdminAction'

type Props = {
  feedback: Feedback | null
  onDismiss?: () => void
}

export default function AdminFeedback({ feedback, onDismiss }: Props) {
  if (!feedback) return null

  const isSuccess = feedback.type === 'success'

  return (
    <div className={`admin-alert admin-alert--${isSuccess ? 'success' : 'error'} admin-feedback`} role="status">
      {isSuccess ? <FiCheckCircle /> : <FiAlertCircle />}
      <span>{feedback.message}</span>
      {onDismiss && (
        <button type="button" className="admin-feedback-dismiss" onClick={onDismiss} aria-label="Dismiss">
          <FiX />
        </button>
      )}
    </div>
  )
}
