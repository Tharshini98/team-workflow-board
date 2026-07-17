export function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component
      className={`rounded-md2 border border-ink-300/60 bg-white shadow-card ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
