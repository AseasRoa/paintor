import { template } from 'paintor'

function deleteTask(tasks, task) {
  tasks.splice(getTaskIndex(tasks, task), 1)
}

function getTaskIndex(tasks, task) {
  return tasks.indexOf(task)
}

function toggleCompleted(task) {
  task.completed = !task.completed
}

export function ToDoTaskItem(tasks, task) {
  return template((x) => {
    x.li({
        class: () => (task.completed ? 'completed' : ''),
        onClick: () => toggleCompleted(task)
      },
      task.title,
      x.button(
        {
          onClick: () => deleteTask(tasks, task)
        },
        '\u00D7'
      )
    )
  })
}
