import { component, state, template } from 'paintor'

const tasks = state([
  {
    title: 'Make to-do list',
    completed: true
  },
  {
    title: 'Hit the gym',
    completed: false
  }
])

const newTask = {
  title: '',
  completed: false
}

function addTask() {
  if (!newTask.title) {
    alert('You must write a title for your new task!')
  }
  else {
    tasks.push({ ...newTask })
  }
}

function deleteTask(task) {
  tasks.splice(getTaskKey(task), 1)
}

function getTaskKey(task) {
  return tasks.indexOf(task)
}

function toggleCompleted(task) {
  task.completed = !task.completed
}

const todoHeader = template(($) => {
  $.h3('Tasks ', $.span(() => `(${tasks.length})`)),
  $.div(
    { class: 'header' },

    $.input(
      {
        type: 'text',
        placeholder: 'New Task...',
        onKeyUp: (event) => {
          newTask.title = event.target.value
        }
      }
    ),
    $.button({ onClick: addTask }, 'Add')
  )
})

const taskItem = (task) => template(($) => {
  $.li(
    {
      class: () => (task.completed ? 'completed' : ''),
      onClick: () => toggleCompleted(task)
    },
    task.title,
    $.button({
      onClick: () => deleteTask(task)
    }, '\u00D7')
  )
})

const todoTasks = template(($) => {
  $.ul(
    $.forEach(tasks, taskItem)
  )
})

const toDoComponent = component(
  todoHeader,
  todoTasks
)

toDoComponent.paint('#to-do-list')
