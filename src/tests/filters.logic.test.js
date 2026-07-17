import { describe, it, expect } from 'vitest'
import { applyFilters } from '../hooks/useUrlFilters'

const tasks = [
  { id: '1', title: 'Alpha', description: '', status: 'Backlog', priority: 'Low', createdAt: '2024-01-01', updatedAt: '2024-01-03' },
  { id: '2', title: 'Beta', description: 'contains keyword', status: 'Done', priority: 'High', createdAt: '2024-01-02', updatedAt: '2024-01-01' },
  { id: '3', title: 'Gamma', description: '', status: 'In Progress', priority: 'Medium', createdAt: '2024-01-03', updatedAt: '2024-01-02' },
]

describe('applyFilters', () => {
  it('filters by status', () => {
    const result = applyFilters(tasks, { status: ['Done'], priority: [], q: '', sort: 'updatedAt', dir: 'desc' })
    expect(result.map((t) => t.id)).toEqual(['2'])
  })

  it('filters by search text across title and description', () => {
    const result = applyFilters(tasks, { status: [], priority: [], q: 'keyword', sort: 'updatedAt', dir: 'desc' })
    expect(result.map((t) => t.id)).toEqual(['2'])
  })

  it('sorts by priority ascending', () => {
    const result = applyFilters(tasks, { status: [], priority: [], q: '', sort: 'priority', dir: 'asc' })
    expect(result.map((t) => t.id)).toEqual(['1', '3', '2'])
  })
})
