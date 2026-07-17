const TONES = {
  neutral: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-100 text-brand-600',
  good: 'bg-good-100 text-good-600',
  warn: 'bg-warn-100 text-warn-600',
  bad: 'bg-bad-100 text-bad-600',
}

const PRIORITY_TONE = { Low: 'neutral', Medium: 'warn', High: 'bad' }

export function Tag({ tone = 'neutral', children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  )
}
export function PriorityTag({ priority }) {
  return <Tag tone={PRIORITY_TONE[priority] ?? 'neutral'}>{priority}</Tag>
}
