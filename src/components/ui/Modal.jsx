import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({ isOpen, onClose, title, description, children, preventBackdropClose = false }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const descId = useId()
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement

    const node = dialogRef.current
    const focusables = node?.querySelectorAll(FOCUSABLE_SELECTOR)
    const first = focusables?.[0]
    first?.focus()

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const focusableEls = node.querySelectorAll(FOCUSABLE_SELECTOR)
      if (focusableEls.length === 0) return
      const firstEl = focusableEls[0]
      const lastEl = focusableEls[focusableEls.length - 1]

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Return focus to whatever opened the modal.
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-900/40"
        onClick={preventBackdropClose ? undefined : onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="relative z-10 w-full max-w-lg rounded-md2 bg-white p-6 shadow-pop"
      >
        <h2 id={titleId} className="font-display text-xl font-semibold text-ink-900">
          {title}
        </h2>
        {description && (
          <p id={descId} className="mt-1 text-sm text-ink-500">
            {description}
          </p>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}
