import { template } from 'paintor'

const newTask = { title: '', completed: false }

function addTask(tasks, newTask) {
  if (!newTask.title) {
    alert('You must write a title for your new task!')
  }
  else {
    tasks.push({ ...newTask })
  }
}

export function ToDoHeader(props) {
  return template((x) => {
    x.h3('Tasks ', x.span(() => `(${props.tasks.length})`)),
      x.div({ class: 'header' },
        x.input(
          {
            type: 'text',
            placeholder: 'New Task...',
            onKeyUp: (event) => {
              newTask.title = event.target.value
            }
          }
        ),
        x.button({
          onClick: () => addTask(props.tasks, newTask) },
          'Add'
        )
      )
  })
}
