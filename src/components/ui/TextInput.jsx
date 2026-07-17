import { Field } from './Field'

const baseClasses =
  'h-10 rounded-md2 border bg-white px-3 text-sm text-ink-900 placeholder:text-ink-300 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:border-brand-600'

export function TextInput({ label, error, hint, required, className = '', ...props }) {
  return (
    <Field label={label} error={error} hint={hint} required={required}>
      {(fieldProps) => (
        <input
          {...fieldProps}
          {...props}
          className={`${baseClasses} ${error ? 'border-bad-600' : 'border-ink-300'} ${className}`}
        />
      )}
    </Field>
  )
}
