import type { Country } from '../types'
import './Flag.css'

interface FlagProps {
  country: Country
  eager?: boolean
}

export function Flag({ country, eager = false }: FlagProps) {
  return (
    <div className="flag">
      <img
        className="flag__image"
        src={country.flags.svg}
        alt=""
        width={320}
        height={192}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={(event) => {
          event.currentTarget.dataset.failed = 'true'
        }}
      />
    </div>
  )
}
