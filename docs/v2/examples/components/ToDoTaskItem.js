import { template } from 'paintor'

function deleteTask(task) {
  tasks.splice(getTaskIndex(task), 1)
}

function getTaskIndex(task) {
  return tasks.indexOf(task)
}

function toggleCompleted(task) {
  task.completed = !task.completed
}

export function ToDoTaskItem(task) {
  return template((x) => {
    x.li({
        class: () => (task.completed ? 'completed' : ''),
        onClick: () => toggleCompleted(task)
      },
      task.title,
      x.button(
        {
          onClick: () => deleteTask(task)
        },
        '\u00D7'
      )
    )
  })
}
