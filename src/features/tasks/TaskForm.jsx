import { useEffect, useMemo, useState } from 'react'
import { TextInput } from '../../components/ui/TextInput'
import { TextArea } from '../../components/ui/TextArea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { STATUSES, PRIORITIES } from '../../data/seed'

const EMPTY = { title: '', description: '', status: 'Backlog', priority: 'Medium', assignee: '', tags: '' }

function toFormState(task) {
  if (!task) return EMPTY
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    tags: task.tags.join(', '),
  }
}

function validate(values) {
  const errors = {}
  if (!values.title.trim()) {
    errors.title = 'Title is required.'
  } else if (values.title.trim().length > 100) {
    errors.title = 'Title must be 100 characters or fewer.'
  }
  if (values.description.trim().length > 2000) {
    errors.description = 'Description must be 2000 characters or fewer.'
  }
  return errors
}

/**
 * onDirtyChange lets the parent (Modal host) know whether there are unsaved
 * changes, so it can warn before closing — see the "dirty state" requirement.
 */
export function TaskForm({ initialTask, onSubmit, onCancel, onDirtyChange }) {
  const initial = useMemo(() => toFormState(initialTask), [initialTask])
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const isDirty = JSON.stringify(values) !== JSON.stringify(initial)

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validate({ ...values }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const foundErrors = validate(values)
    setErrors(foundErrors)
    setTouched({ title: true, description: true })
    if (Object.keys(foundErrors).length > 0) return

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      assignee: values.assignee.trim(),
      tags: values.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextInput
        label="Title"
        required
        value={values.title}
        onChange={(e) => update('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        error={touched.title ? errors.title : undefined}
        placeholder="e.g. Add drag-and-drop between columns"
        autoFocus
      />

      <TextArea
        label="Description"
        value={values.description}
        onChange={(e) => update('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
        hint="Multi-line is fine — context, acceptance criteria, links."
        placeholder="What needs to happen, and how we'll know it's done…"
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          value={values.status}
          onChange={(e) => update('status', e.target.value)}
          options={STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <Select
          label="Priority"
          value={values.priority}
          onChange={(e) => update('priority', e.target.value)}
          options={PRIORITIES.map((p) => ({ value: p, label: p }))}
        />
      </div>

      <TextInput
        label="Assignee"
        value={values.assignee}
        onChange={(e) => update('assignee', e.target.value)}
        placeholder="e.g. Priya"
      />

      <TextInput
        label="Tags"
        value={values.tags}
        onChange={(e) => update('tags', e.target.value)}
        hint="Comma-separated, e.g. board, a11y"
        placeholder="board, a11y"
      />

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialTask ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  )
}
