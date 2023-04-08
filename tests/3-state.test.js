import { component, state, template } from '../src/paintor.js'

describe('State', () => {
  const id = 'container'

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('Simple Counter', () => {
    const container = document.body

    const globalState = state({ clicks: 0 })

    component(($) => {
      $.button({
        textContent: 'Click me',
        onClick: () => {
          globalState.clicks += 1
        },
      })
      $.p({ textContent: () => (globalState.clicks) })
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
    const globalState = state(object)

    component(($) => {
      $.forState(globalState, (value, key) => {
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
    globalState.color = 'red'

    div = container.getElementsByTagName('div')[0]

    expect(div instanceof HTMLDivElement).toBe(true)
    expect(div.textContent).toBe('color:red')
    expect(div.style.color).toBe('red')

    // Change text content
    globalState.color = 'blue'
    expect(div.textContent).toBe('color:blue')
    expect(div.style.color).toBe('blue')
  })
})
