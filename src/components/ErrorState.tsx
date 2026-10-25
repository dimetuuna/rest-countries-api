import './StateMessage.css'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-message" role="alert">
      <p>Could not load countries.</p>
      <p className="state-message__detail">{message}</p>
      <button type="button" className="state-message__action" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
