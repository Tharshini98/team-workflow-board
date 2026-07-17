import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const DEFAULTS = {
  status: [], 
  priority: [],
  q: '',
  sort: 'updatedAt',
  dir: 'desc',
}

function parseList(value) {
  if (!value) return []
  return value.split(',').filter(Boolean)
}


export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      status: parseList(searchParams.get('status')),
      priority: parseList(searchParams.get('priority')),
      q: searchParams.get('q') ?? DEFAULTS.q,
      sort: searchParams.get('sort') ?? DEFAULTS.sort,
      dir: searchParams.get('dir') ?? DEFAULTS.dir,
    }),
    [searchParams]
  )

  const patch = useCallback(
    (next) => {
      const merged = { ...filters, ...next }
      const params = new URLSearchParams()
      if (merged.status.length) params.set('status', merged.status.join(','))
      if (merged.priority.length) params.set('priority', merged.priority.join(','))
      if (merged.q) params.set('q', merged.q)
      if (merged.sort !== DEFAULTS.sort) params.set('sort', merged.sort)
      if (merged.dir !== DEFAULTS.dir) params.set('dir', merged.dir)
      setSearchParams(params, { replace: true })
    },
    [filters, setSearchParams]
  )

  const toggleInList = useCallback(
    (key, value) => {
      const current = filters[key]
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      patch({ [key]: next })
    },
    [filters, patch]
  )

  const setQuery = useCallback((q) => patch({ q }), [patch])
  const setSort = useCallback((sort) => patch({ sort }), [patch])
  const setDir = useCallback((dir) => patch({ dir }), [patch])
  const clearAll = useCallback(() => setSearchParams(new URLSearchParams(), { replace: true }), [setSearchParams])

  return { filters, toggleInList, setQuery, setSort, setDir, clearAll }
}


export function applyFilters(tasks, filters) {
  const q = filters.q.trim().toLowerCase()
  let result = tasks.filter((t) => {
    if (filters.status.length && !filters.status.includes(t.status)) return false
    if (filters.priority.length && !filters.priority.includes(t.priority)) return false
    if (q && !`${t.title} ${t.description}`.toLowerCase().includes(q)) return false
    return true
  })

  const priorityRank = { Low: 0, Medium: 1, High: 2 }
  const dirMul = filters.dir === 'asc' ? 1 : -1

  result = [...result].sort((a, b) => {
    if (filters.sort === 'priority') {
      return (priorityRank[a.priority] - priorityRank[b.priority]) * dirMul
    }
    const aVal = new Date(a[filters.sort]).getTime()
    const bVal = new Date(b[filters.sort]).getTime()
    return (aVal - bVal) * dirMul
  })

  return result
}
