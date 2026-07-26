import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  action?: { label: string; href: string }
}

export function SectionHeader({ title, subtitle, align = 'center', action }: SectionHeaderProps) {
  return (
    <div
      className={`mb-10 md:mb-14 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {subtitle && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {subtitle}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold text-chocolate md:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div
        className={`mx-auto mt-4 h-0.5 w-16 bg-gradient-to-r from-gold/60 via-gold to-gold/60 ${
          align === 'center' ? 'mx-auto' : 'ml-0'
        }`}
      />
      {action && (
        <Link
          to={action.href}
          className={`group mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-muted ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
