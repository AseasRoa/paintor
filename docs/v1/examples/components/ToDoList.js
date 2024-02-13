import { component, state, template } from 'paintor'

const tasks = state([])
const newTask = { title: '', completed: false }

function addTask() {
  if (!newTask.title) {
    alert('You must write a title for your new task!')
  }
  else {
    tasks.push({ ...newTask })
  }
}

function deleteTask(task) {
  tasks.splice(getTaskIndex(task), 1)
}

function getTaskIndex(task) {
  return tasks.indexOf(task)
}

function toggleCompleted(task) {
  task.completed = !task.completed
}

const todoHeader = template(({ h3, span, div, input, button }) => {
  h3('Tasks ', span(() => `(${tasks.length})`)),
    div(
      { class: 'header' },
      input(
        {
          type: 'text',
          placeholder: 'New Task...',
          onKeyUp: (event) => {
            newTask.title = event.target.value
          }
        }
      ),
      button({ onClick: addTask }, 'Add')
    )
})

const taskItem = (task) => template(({ li, button }) => {
  li(
    {
      class: () => (task.completed ? 'completed' : ''),
      onClick: () => toggleCompleted(task)
    },
    task.title,
    button(
      {
        onClick: () => deleteTask(task)
      },
      '\u00D7'
    )
  )
})

const todoTasks = template(({ ul, forEach }) => {
  ul(
    forEach(tasks, taskItem)
  )
})

const ToDoList = (initialTasks) => {
  // Push the initial tasks into the state
  for (const initialTask of initialTasks) {
    tasks.push(initialTask)
  }

  // Create and return the component
  return component(
    todoHeader,
    todoTasks
  )
}

export { ToDoList }
