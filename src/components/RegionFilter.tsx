import { useId } from 'react'
import './RegionFilter.css'

interface RegionFilterProps {
  regions: string[]
  value: string | null
  onChange: (region: string | null) => void
}

export function RegionFilter({ regions, value, onChange }: RegionFilterProps) {
  const id = useId()

  return (
    <div className="region-filter">
      <label className="visually-hidden" htmlFor={id}>
        Filter by Region
      </label>
      <select
        id={id}
        className="region-filter__select"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value === '' ? null : event.target.value)}
      >
        <option value="">Filter by Region</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <svg
        className="region-filter__chevron"
        viewBox="0 0 12 8"
        width="12"
        height="8"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M1 1.5 6 6.5l5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
