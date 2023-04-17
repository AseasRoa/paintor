import { component, state } from '../src/paintor.js'

describe('State', () => {
  const id = 'container'

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('(DOM) Simple Counter', () => {
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

  test('(HTML-DOM) Simple Counter', () => {
    const container = document.body

    const globalState = state({ clicks: 0 })

    component(($) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      $.html`
<button onclick="${() => globalState.clicks += 1}">Click me</button>
<p>${() => (globalState.clicks)}</p>
      `
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

  test('(DOM) New DOM element, created from the State, is reactive', () => {
    const container = document.body

    /** @type {Object<string, string>} */
    const globalState = state({})

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

  test('(HTML-DOM) New DOM element, created from the State, is reactive', () => {
    const container = document.body

    /** @type {Object<string, string>} */
    const globalState = state({})

    component(($) => {
      $.forState(globalState, (value, key) => {
        $.html`
<div style="color: ${value}">${() => `${key}:${value()}`}</div>
`
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
