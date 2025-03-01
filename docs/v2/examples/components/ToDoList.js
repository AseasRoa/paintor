import { state, template } from 'paintor'
import { ToDoHeader } from './ToDoHeader.js'
import { ToDoTasks } from './ToDoTasks.js'

const tasks = state([])

export function ToDoList({ initialTasks }) {
  // Push the initial tasks into the state
  for (const initialTask of initialTasks) {
    tasks.push(initialTask)
  }

  return template(() => [
    ToDoHeader({ tasks }),
    ToDoTasks({ tasks }),
  ])
}
