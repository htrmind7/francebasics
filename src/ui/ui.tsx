import type { ReactNode } from 'react'
import type { Category } from '../content/schemas.ts'
import { Icon } from './Icon.tsx'

/** Rounded colored tile holding an icon; the color comes from the category tone. */
export function IconTile({
  icon,
  tone,
  size = 52,
}: {
  icon: string
  tone: Category['tone']
  size?: number
}) {
  return (
    <span className={`tile tone-${tone}`} style={{ width: size, height: size }}>
      <Icon name={icon} size={Math.round(size * 0.5)} />
    </span>
  )
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="back-link" href={href}>
      <Icon name="back" size={20} />
      {label}
    </a>
  )
}

export function ProgressBar({
  value,
  total,
}: {
  value: number
  total: number
}) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100)
  return (
    <div
      className="bar"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={total}
    >
      <div className="bar-fill" style={{ width: `${percent}%` }} />
    </div>
  )
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return <p className="disclaimer">{children}</p>
}
