import { ToastProvider } from './components/ui/Toast'
import { TaskBoard } from './features/tasks/TaskBoard'

export default function App() {
  return (
    <ToastProvider>
      <TaskBoard />
    </ToastProvider>
  )
}
