import './StateMessage.css'

export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="state-message">
      <p>No countries found</p>
      <button type="button" className="state-message__action" onClick={onClear}>
        Clear filters
      </button>
    </div>
  )
}
