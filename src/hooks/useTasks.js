import { useCallback, useEffect, useRef, useState } from 'react'
import { loadTasks, saveTasks, isStorageAvailable } from '../utils/storage'
import { seedTasks } from '../data/seed'
import { makeId } from '../utils/id'
export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [status, setStatus] = useState('loading') 
  const [migrationNotice, setMigrationNotice] = useState(null)
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (!isStorageAvailable()) {
      setStatus('unavailable')
      setTasks(seedTasks())
      return
    }
    const { tasks: loaded, migrated, error } = loadTasks()
    if (error) {
      setStatus('unavailable')
      setTasks(seedTasks())
      return
    }
    if (loaded === null) {
      const initial = seedTasks()
      setTasks(initial)
      saveTasks(initial)
    } else {
      setTasks(loaded)
    }
    if (migrated) {
      setMigrationNotice('Your saved data was upgraded to the latest format.')
    }
    setStatus('ready')
    hasLoaded.current = true
  }, [])

  
  useEffect(() => {
    if (!hasLoaded.current) return
    saveTasks(tasks)
  }, [tasks])

  const createTask = useCallback((input) => {
    const nowIso = new Date().toISOString()
    const task = {
      id: makeId(),
      title: input.title.trim(),
      description: input.description?.trim() ?? '',
      status: input.status,
      priority: input.priority,
      assignee: input.assignee?.trim() ?? '',
      tags: input.tags ?? [],
      createdAt: nowIso,
      updatedAt: nowIso,
    }
    setTasks((prev) => [task, ...prev])
    return task
  }, [])

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...patch, updatedAt: new Date().toISOString() }
          : t
      )
    )
  }, [])

  const moveTask = useCallback((id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      )
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissMigrationNotice = useCallback(() => setMigrationNotice(null), [])

  return {
    tasks,
    status,
    migrationNotice,
    dismissMigrationNotice,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
  }
}
