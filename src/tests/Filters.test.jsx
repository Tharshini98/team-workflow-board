import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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

describe('filtering by status', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('narrows the board to only the selected status and updates the URL', async () => {
    const user = userEvent.setup()
    renderApp()

    
    expect(await screen.findByText('Sketch component library tokens')).toBeInTheDocument() // Done

    const statusGroup = screen.getByRole('group', { name: /filter by status/i })
    await user.click(within(statusGroup).getByRole('button', { name: 'Done' }))

    
    expect(screen.getByText('Sketch component library tokens')).toBeInTheDocument()
    
    expect(screen.queryByText('Accessible modal focus trap')).not.toBeInTheDocument()

    
    expect(window.location.search).toContain('status=Done')

    
    await user.click(within(statusGroup).getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Accessible modal focus trap')).toBeInTheDocument()
    expect(window.location.search).not.toContain('status=')
  })
})
