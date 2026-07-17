import { forwardRef } from 'react'

const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-500 focus-visible:ring-brand-600 disabled:bg-ink-300',
  secondary: 'bg-white text-ink-700 border border-ink-300 hover:bg-ink-100 focus-visible:ring-ink-500 disabled:text-ink-300',
  destructive: 'bg-bad-600 text-white hover:bg-red-700 focus-visible:ring-bad-600 disabled:bg-ink-300',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100 focus-visible:ring-ink-500',
}

const SIZES = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-5 text-base gap-2',
}

/**
 * Button — the single button primitive for the app.
 * variant: 'primary' | 'secondary' | 'destructive' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', iconLeft, iconRight, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md2 font-medium transition-colors
        disabled:cursor-not-allowed disabled:opacity-70
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
})
