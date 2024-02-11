import { random } from './functions.js'
import { adjectives, colours, nouns } from './constants.js'
import { state } from '../node_modules/paintor/lib/index.js'

export class Store {
  /** @type {DataItem[]} */
  data = state([])

  /** @type {SelectedItem} */
  selected = state({ id: undefined })

  /** @type {number} id */
  #id = 1

  constructor() {
    this.delete = this.delete.bind(this)
    this.select = this.select.bind(this)
  }

  /**
   * @param {number} [count]
   */
  appendData(count = 1000) {
    const length = this.data.length

    for (let i = length; i < length + count; i++) {
      const id = this.#id++
      const adjective = adjectives[random(adjectives.length)]
      const colour = colours[random(colours.length)]
      const noun = nouns[random(nouns.length)]
      const label = `${adjective} ${colour} ${noun}`

      this.data[i] = { id, label }
    }
  }

  updateData() {
    for (let i = 0; i < this.data.length; i += 10) {
      this.data[i].label += ' !!!'
    }
  }

  /**
   * @param {number} id
   */
  delete(id) {
    const idx = this.data.findIndex((d) => d.id === id)

    this.data.splice(idx, 1)
  }

  run() {
    this.clear()
    this.appendData(1000)
    this.selected.id = undefined
  }

  add() {
    this.appendData(1000)
    this.selected.id = undefined
  }

  update() {
    this.updateData()
    this.selected.id = undefined
  }

  /**
   * @param {number} id
   */
  select(id) {
    this.selected.id = id
  }

  runLots() {
    this.clear()
    this.appendData(10000)
    this.selected.id = undefined
  }

  clear() {
    this.data.length = 0
    this.selected.id = undefined
  }

  swapRows() {
    const { data } = this

    if (data.length > 998) {
      if (!data[1] || !data[998]) {
        throw new Error('Missing data element')
      }

      const a = data[1]

      data[1] = data[998]
      data[998] = a
    }
  }
}
