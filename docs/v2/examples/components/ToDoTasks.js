import { template } from 'paintor'
import { ToDoTaskItem } from './ToDoTaskItem.js'

export function ToDoTasks(props) {
  return template((x) => {
    x.ul(
      x.$each(props.tasks, ToDoTaskItem)
    )
  })
}
