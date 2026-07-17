import { STATUSES, PRIORITIES } from '../../data/seed'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'

const SORT_OPTIONS = [
  { value: 'updatedAt', label: 'Last updated' },
  { value: 'createdAt', label: 'Date created' },
  { value: 'priority', label: 'Priority' },
]

export function FiltersBar({ filters, toggleInList, setQuery, setSort, setDir, clearAll }) {
  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0 || filters.q.length > 0

  return (
    <div className="flex flex-col gap-3 rounded-md2 border border-ink-300/60 bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[220px] flex-1">
          <label htmlFor="task-search" className="text-sm font-medium text-ink-700">
            Search
          </label>
          <input
            id="task-search"
            type="search"
            value={filters.q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or description…"
            className="mt-1.5 h-10 w-full rounded-md2 border border-ink-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:border-brand-600"
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-ink-700">Status</legend>
          <div className="mt-1.5 flex gap-1.5" role="group" aria-label="Filter by status">
            {STATUSES.map((s) => {
              const active = filters.status.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleInList('status', s)}
                  className={`h-10 rounded-md2 border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                    active ? 'border-brand-600 bg-brand-100 text-brand-600' : 'border-ink-300 bg-white text-ink-700 hover:bg-ink-100'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-ink-700">Priority</legend>
          <div className="mt-1.5 flex gap-1.5" role="group" aria-label="Filter by priority">
            {PRIORITIES.map((p) => {
              const active = filters.priority.includes(p)
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleInList('priority', p)}
                  className={`h-10 rounded-md2 border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                    active ? 'border-brand-600 bg-brand-100 text-brand-600' : 'border-ink-300 bg-white text-ink-700 hover:bg-ink-100'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </fieldset>

        <Select
          label="Sort by"
          value={filters.sort}
          onChange={(e) => setSort(e.target.value)}
          options={SORT_OPTIONS}
          className="w-40"
        />

        <Select
          label="Direction"
          value={filters.dir}
          onChange={(e) => setDir(e.target.value)}
          options={[
            { value: 'desc', label: 'Descending' },
            { value: 'asc', label: 'Ascending' },
          ]}
          className="w-36"
        />

        {hasActiveFilters && (
          <Button variant="ghost" size="md" onClick={clearAll} type="button">
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
