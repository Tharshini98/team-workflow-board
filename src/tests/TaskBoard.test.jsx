import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import App from '../App.jsx'

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

describe('creating a task', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('adds a new task and shows it in the Backlog column', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /new task/i }))

    const dialog = screen.getByRole('dialog', { name: /new task/i })
    await user.type(screen.getByLabelText(/title/i), 'Write onboarding docs')
    await user.type(screen.getByLabelText(/assignee/i), 'Morgan')

    await user.click(screen.getByRole('button', { name: /create task/i }))
    expect(dialog).not.toBeInTheDocument()

    expect(screen.getByText('Write onboarding docs')).toBeInTheDocument()
    expect(screen.getByText('Morgan')).toBeInTheDocument()

    
    expect(await screen.findByText(/task created/i)).toBeInTheDocument()
  })

  it('shows a validation error and does not create the task when title is empty', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /new task/i }))
    await user.click(screen.getByRole('button', { name: /create task/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/title is required/i)
  })
})
