import { compose, createState } from '../src/index.js'
import { Window } from '../src/SrDOM/Window.js'

describe('Paintor Tests', () => {
  const id = 'container'

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('Paint elements in element by id', () => {
    const container = document.createElement('div')
    container.id = id
    document.body.appendChild(container)

    compose(($) => {
      $.div('div 1')
      $.div('div 2')
      $.div('div 3')
    }).paint(`#${id}`)

    expect(container.childNodes.length).toBe(3)
  })

  test('Paint elements in element by element', () => {
    const container = document.createElement('div')
    container.id = id
    document.body.appendChild(container)

    compose(($) => {
      $.div('div 1')
      $.div('div 2')
      $.div('div 3')
    }).paint(container)

    expect(container.childNodes.length).toBe(3)
  })

  test('Paint elements in web component', () => {
    const container = document.createElement('web-component-element')
    document.body.appendChild(container)

    compose(($) => {
      $.div('div 1')
      $.div('div 2')
      $.div('div 3')
    }).paint('web-component-element')

    expect(container.shadowRoot?.children.length).toBe(3)
  })

  test('Paint a table', () => {
    const container = document.body

    compose(($) => {
      $.table(
        $.tr(
          $.td('Row 1, Column 1'),
          $.td('Row 1, Column 2'),
        ),
        $.tr(
          $.td('Row 2, Column 1'),
          $.td('Row 2, Column 2'),
        ),
      )
    }).paint(container)

    const table = container.children[0]

    expect(container.children.length).toBe(1)
    expect(table.tagName).toBe('TABLE')

    expect(table.children.length).toBe(2)
    expect(table.children[0].tagName).toBe('TR')
    expect(table.children[1].tagName).toBe('TR')

    expect(table.children[0].children.length).toBe(2)
    expect(table.children[0].children[0].tagName).toBe('TD')
    expect(table.children[0].children[0].children.length).toBe(0)
    expect(table.children[0].children[0].textContent).toBe('Row 1, Column 1')
    expect(table.children[0].children[1].tagName).toBe('TD')
    expect(table.children[0].children[1].children.length).toBe(0)
    expect(table.children[0].children[1].textContent).toBe('Row 1, Column 2')

    expect(table.children[1].children.length).toBe(2)
    expect(table.children[1].children[0].tagName).toBe('TD')
    expect(table.children[1].children[0].children.length).toBe(0)
    expect(table.children[1].children[0].textContent).toBe('Row 2, Column 1')
    expect(table.children[1].children[1].tagName).toBe('TD')
    expect(table.children[1].children[1].children.length).toBe(0)
    expect(table.children[1].children[1].textContent).toBe('Row 2, Column 2')
  })

  test('Using state: simple counter', () => {
    const container = document.body

    const state = createState({ clicks: 0 })

    compose(($) => {
      $.button({
        textContent: 'Click me',
        onClick: () => {
          state.clicks += 1
        },
      })
      $.p({ textContent: () => (state.clicks) })
    }).paint(container)

    const button = container.getElementsByTagName('button')[0]
    const p = container.getElementsByTagName('p')[0]

    expect(button instanceof HTMLButtonElement).toBe(true)
    expect(p instanceof HTMLParagraphElement).toBe(true)
    expect(p.textContent).toBe('0')

    for (let i = 0; i < 10; i++) {
      button.click()
    }

    expect(p.textContent).toBe('10')
  })

  test('New DOM element, created from the State, is reactive', () => {
    const container = document.body

    /** @type {Object<string, string>} */
    const object = {}
    const state = createState(object)

    compose(($) => {
      $.forState(state, (value, key) => {
        $.div(
          { style: { color: value } },
          () => `${key}:${value()}`,
        )
      })
    }).paint(container)

    // Initially we have no <li> elements
    let div = container.getElementsByTagName('div')[0]

    expect(div).toBe(undefined)

    // Create one <li> element
    state.color = 'red'

    div = container.getElementsByTagName('div')[0]

    expect(div instanceof HTMLDivElement).toBe(true)
    expect(div.textContent).toBe('color:red')
    expect(div.style.color).toBe('red')

    // Change text content
    state.color = 'blue'
    expect(div.textContent).toBe('color:blue')
    expect(div.style.color).toBe('blue')
  })
})
