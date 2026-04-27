import React from 'react'

interface LogoProps {
  size?: number
  className?: string
}

export function WealthMirrorLogo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="20" r="18" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="20" cy="20" r="12" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="20" cy="20" r="6" fill="#e5a82e" fillOpacity="0.15" />
      <circle cx="20" cy="20" r="3" fill="#e5a82e" fillOpacity="0.8" />
      <line x1="20" y1="2" x2="20" y2="7" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="20" y1="33" x2="20" y2="38" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="2" y1="20" x2="7" y2="20" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="33" y1="20" x2="38" y2="20" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
    </svg>
  )
}
