import { memo } from 'react'
import { Card } from '../../components/ui/Card'
import { Tag, PriorityTag } from '../../components/ui/Tag'
import { relativeTime } from '../../utils/relativeTime'

export const TaskCard = memo(function TaskCard({ task, onEdit, onDragStart }) {
  return (
    <Card
      as="article"
      draggable
      onDragStart={(e) => onDragStart?.(e, task.id)}
      className="cursor-grab p-4 transition-shadow hover:shadow-pop active:cursor-grabbing"
    >
      <button
        onClick={() => onEdit(task)}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-md2"
        aria-label={`Edit task: ${task.title}`}
      >
        <h3 className="font-medium text-ink-900">{task.title}</h3>
      </button>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <PriorityTag priority={task.priority} />
        {task.tags.map((tag) => (
          <Tag key={tag} tone="neutral">
            {tag}
          </Tag>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
        <span>{task.assignee || 'Unassigned'}</span>
        <span title={new Date(task.updatedAt).toLocaleString()}>updated {relativeTime(task.updatedAt)}</span>
      </div>
    </Card>
  )
})
