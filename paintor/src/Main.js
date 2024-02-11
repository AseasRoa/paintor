import { Store } from './Store.js'
import { jumbotron, rows } from './templates.js'
import { component, state } from '../node_modules/paintor/lib/index.js'

class Main {
  /** @type {Store} */
  store = new Store()

  constructor() {
    component(($) => {
      $.div(
        { class: 'container' },
        jumbotron(this),
        rows(this.store)
      )
    }).paint('#main')
  }

  add() {
    this.store.add()
  }

  clear() {
    this.store.clear()
  }

  run() {
    this.store.run()
  }

  runLots() {
    this.store.runLots()
  }

  swapRows() {
    this.store.swapRows()
  }

  update() {
    this.store.update()
  }
}

new Main()
