

export const STORAGE_KEY = 'team-workflow-board:v1'
export const CURRENT_SCHEMA_VERSION = 2

const migrations = {
  1: (data) => ({
    schemaVersion: 2,
    tasks: data.tasks.map((task) => ({
      priority: 'Medium',
      tags: [],
      ...task,
    })),
  }),
}

function runMigrations(data) {
  let current = data
  let migrated = false
  while (current.schemaVersion < CURRENT_SCHEMA_VERSION) {
    const step = migrations[current.schemaVersion]
    if (!step) {
     
      break
    }
    current = step(current)
    migrated = true
  }
  return { data: current, migrated }
}
export function loadTasks() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { tasks: null, migrated: false, error: null }
    }
    const parsed = JSON.parse(raw)
    const { data, migrated } = runMigrations(parsed)
    if (migrated) {
     
      saveTasks(data.tasks)
    }
    return { tasks: data.tasks, migrated, error: null }
  } catch (err) {
    return { tasks: null, migrated: false, error: err }
  }
}
export function saveTasks(tasks) {
  try {
    const payload = JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION, tasks })
    window.localStorage.setItem(STORAGE_KEY, payload)
    return { ok: true, error: null }
  } catch (err) {
    
    return { ok: false, error: err }
  }
}


export function isStorageAvailable() {
  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
