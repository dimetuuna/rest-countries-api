import { useLocation, useNavigate } from 'react-router-dom'
import './BackButton.css'

export function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    // A directly opened detail page has no in-app history to return to.
    if (location.key === 'default') {
      navigate('/')
      return
    }
    navigate(-1)
  }

  return (
    <button type="button" className="back-button" onClick={goBack}>
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
        <path
          d="M17 10H4m5-6-6 6 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Back</span>
    </button>
  )
}
