import { ToDoList } from './components/ToDoList.js'

const initialTasks = [
  {
    title: 'Make to-do list',
    completed: true
  },
  {
    title: 'Hit the gym',
    completed: false
  }
]

ToDoList(initialTasks).paint('#to-do-list')
