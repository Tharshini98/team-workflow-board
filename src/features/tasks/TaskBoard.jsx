import { useMemo, useState } from 'react'
import { STATUSES } from '../../data/seed'
import { useTasks } from '../../hooks/useTasks'
import { useUrlFilters, applyFilters } from '../../hooks/useUrlFilters'
import { useDirtyGuard } from '../../hooks/useDirtyGuard'
import { useToast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { TaskColumn } from './TaskColumn'
import { TaskForm } from './TaskForm'
import { FiltersBar } from './FiltersBar'

export function TaskBoard() {
  const { tasks, status, migrationNotice, dismissMigrationNotice, createTask, updateTask, moveTask, deleteTask } =
    useTasks()
  const { filters, toggleInList, setQuery, setSort, setDir, clearAll } = useUrlFilters()
  const { showToast } = useToast()

  const [modalTask, setModalTask] = useState(null) // null = closed, {} = create, task = edit
  const [isFormDirty, setIsFormDirty] = useState(false)
  useDirtyGuard(isFormDirty)

  const filtered = useMemo(() => applyFilters(tasks, filters), [tasks, filters])
  const byStatus = useMemo(() => {
    const grouped = Object.fromEntries(STATUSES.map((s) => [s, []]))
    for (const task of filtered) {
      if (grouped[task.status]) grouped[task.status].push(task)
    }
    return grouped
  }, [filtered])

  if (status === 'loading') {
    return <p className="p-8 text-center text-ink-500">Loading your board…</p>
  }

  function closeModal() {
    if (isFormDirty) {
      const confirmed = window.confirm('You have unsaved changes. Discard them?')
      if (!confirmed) return
    }
    setModalTask(null)
    setIsFormDirty(false)
  }

  function handleSubmit(values) {
    if (modalTask && modalTask.id) {
      updateTask(modalTask.id, values)
      showToast('Task saved.', { tone: 'success' })
    } else {
      createTask(values)
      showToast('Task created.', { tone: 'success' })
    }
    setModalTask(null)
    setIsFormDirty(false)
  }

  function handleDelete() {
    if (!modalTask?.id) return
    const confirmed = window.confirm(`Delete "${modalTask.title}"? This can't be undone.`)
    if (!confirmed) return
    deleteTask(modalTask.id)
    showToast('Task deleted.', { tone: 'info' })
    setModalTask(null)
    setIsFormDirty(false)
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Team Workflow Board</h1>
          <p className="text-sm text-ink-500">
            {tasks.length} task{tasks.length === 1 ? '' : 's'} total · showing {filtered.length}
          </p>
        </div>
        <Button onClick={() => setModalTask({})}>+ New task</Button>
      </header>

      {status === 'unavailable' && (
        <div role="alert" className="rounded-md2 border border-warn-600/40 bg-warn-100 px-4 py-3 text-sm text-warn-600">
          Local storage isn't available in this browser (private mode, or storage is disabled). Your changes will
          only last for this session.
        </div>
      )}

      {migrationNotice && (
        <div role="status" className="flex items-center justify-between rounded-md2 border border-brand-600/30 bg-brand-100 px-4 py-3 text-sm text-brand-600">
          <span>{migrationNotice}</span>
          <button onClick={dismissMigrationNotice} aria-label="Dismiss" className="font-medium opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      <FiltersBar filters={filters} toggleInList={toggleInList} setQuery={setQuery} setSort={setSort} setDir={setDir} clearAll={clearAll} />

      {tasks.length === 0 ? (
        <div className="rounded-md2 border border-dashed border-ink-300 p-12 text-center">
          <p className="font-display text-lg text-ink-900">No tasks yet</p>
          <p className="mt-1 text-sm text-ink-500">Create your first task to start filling the board.</p>
          <Button className="mt-4" onClick={() => setModalTask({})}>
            + New task
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-md2 border border-dashed border-ink-300 p-12 text-center">
          <p className="font-display text-lg text-ink-900">No tasks match these filters</p>
          <p className="mt-1 text-sm text-ink-500">Try clearing a filter or broadening your search.</p>
          <Button className="mt-4" variant="secondary" onClick={clearAll}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row">
          {STATUSES.map((s) => (
            <TaskColumn
              key={s}
              status={s}
              tasks={byStatus[s]}
              onEdit={(task) => setModalTask(task)}
              onDrop={(taskId, newStatus) => {
                moveTask(taskId, newStatus)
                showToast('Task moved.', { tone: 'success', duration: 2000 })
              }}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalTask !== null}
        onClose={closeModal}
        title={modalTask?.id ? 'Edit task' : 'New task'}
        description={modalTask?.id ? 'Update details and save your changes.' : 'Fill in the details for this task.'}
      >
        <TaskForm
          initialTask={modalTask?.id ? modalTask : null}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          onDirtyChange={setIsFormDirty}
        />
        {modalTask?.id && (
          <div className="mt-4 border-t border-ink-100 pt-4">
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete task
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
