interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'light'
  className?: string
}

const sizes = {
  sm: { container: 'w-8 h-8', svg: 20, text: 'text-xl' },
  md: { container: 'w-10 h-10', svg: 24, text: 'text-2xl' },
  lg: { container: 'w-12 h-12', svg: 28, text: 'text-3xl' },
}

export function Logo({ size = 'md', variant = 'default', className = '' }: LogoProps) {
  const s = sizes[size]
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${s.container} rounded-full ${variant === 'light' ? 'bg-gradient-to-br from-gold to-gold-muted' : 'bg-gradient-to-br from-mocha to-chocolate'} flex items-center justify-center shadow-lg`}>
        <svg
          width={s.svg}
          height={s.svg}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="#EDE8E0" strokeWidth="1.5" fill="none" />
          <path
            d="M8 8c0 0 2 3 2 6s-2 6-2 6"
            stroke="#EDE8E0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 10c-1.5 0-3 1.5-3 3s1.5 3 3 3"
            stroke="#EDE8E0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="15" cy="10" r="1" fill="#EDE8E0" opacity="0.8" />
          <circle cx="14" cy="15" r="0.8" fill="#EDE8E0" opacity="0.6" />
        </svg>
      </div>
    </div>
  )
}
