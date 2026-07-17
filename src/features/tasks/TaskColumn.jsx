import { useState } from 'react'
import { TaskCard } from './TaskCard'

export function TaskColumn({ status, tasks, onEdit, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div
      className={`flex min-h-[200px] flex-1 flex-col gap-3 rounded-md2 border-2 border-dashed p-3 transition-colors ${
        isDragOver ? 'border-brand-500 bg-brand-100/40' : 'border-transparent'
      }`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        const taskId = e.dataTransfer.getData('text/plain')
        if (taskId) onDrop(taskId, status)
      }}
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="font-display text-base font-semibold text-ink-900">{status}</h2>
        <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-500">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 && (
        <p className="rounded-md2 border border-dashed border-ink-300 p-4 text-center text-xs text-ink-500">
          No tasks here. Drag one over, or change filters.
        </p>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDragStart={(e, id) => e.dataTransfer.setData('text/plain', id)}
        />
      ))}
    </div>
  )
}
