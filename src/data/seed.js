import { makeId } from '../utils/id'

const now = new Date()
const hoursAgo = (h) => new Date(now.getTime() - h * 3600 * 1000).toISOString()

export const STATUSES = ['Backlog', 'In Progress', 'Done']
export const PRIORITIES = ['Low', 'Medium', 'High']

export function seedTasks() {
  return [
    {
      id: makeId(),
      title: 'Sketch component library tokens',
      description: 'Define color, spacing and type scale before building Button/Input/Modal.',
      status: 'Done',
      priority: 'High',
      assignee: 'Priya',
      tags: ['design-system'],
      createdAt: hoursAgo(72),
      updatedAt: hoursAgo(50),
    },
    {
      id: makeId(),
      title: 'Board view with drag between columns',
      description: 'Backlog / In Progress / Done columns, cards show priority + assignee + tags.',
      status: 'In Progress',
      priority: 'High',
      assignee: 'Sam',
      tags: ['board', 'core'],
      createdAt: hoursAgo(48),
      updatedAt: hoursAgo(3),
    },
    {
      id: makeId(),
      title: 'URL-synced filters',
      description: 'Status, priority and search should live in the query string so filtered views are shareable.',
      status: 'In Progress',
      priority: 'Medium',
      assignee: 'Alex',
      tags: ['filters'],
      createdAt: hoursAgo(30),
      updatedAt: hoursAgo(6),
    },
    {
      id: makeId(),
      title: 'Storage migration notification toast',
      description: 'Detect an old schemaVersion, migrate silently, then show a small non-blocking toast.',
      status: 'Backlog',
      priority: 'Medium',
      assignee: 'Priya',
      tags: ['persistence'],
      createdAt: hoursAgo(20),
      updatedAt: hoursAgo(20),
    },
    {
      id: makeId(),
      title: 'Accessible modal focus trap',
      description: 'Focus first field on open, return focus to trigger on close, trap Tab within the dialog.',
      status: 'Backlog',
      priority: 'Low',
      assignee: 'Jordan',
      tags: ['a11y', 'modal'],
      createdAt: hoursAgo(10),
      updatedAt: hoursAgo(10),
    },
  ]
}
