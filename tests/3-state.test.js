import { component, state } from '../src/paintor.js'
import { expectTextContentsToBeLike } from './functions.js'

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

    /** @type {Object<string, {color: string}>} */
    const globalState = state({})

    component(($) => {
      $.forState(globalState, (item, key) => {
        $.div(
          { style: { color: () => item.color } },
          () => `${key}:${item.color}`,
        )
      })
    }).paint(container)

    // Initially we have no <li> elements
    let div = container.getElementsByTagName('div')[0]

    expect(div).toBe(undefined)

    // Create one <li> element
    globalState.item = { color: 'red' }

    div = container.getElementsByTagName('div')[0]

    expect(div instanceof HTMLDivElement).toBe(true)
    expect(div.textContent).toBe('item:red')
    expect(div.style.color).toBe('red')

    // Change text content
    globalState.item.color = 'blue'
    expect(div.textContent).toBe('item:blue')
    expect(div.style.color).toBe('blue')
  })

  test('(HTML-DOM) New DOM element, created from the State, is reactive', () => {
    const container = document.body

    /** @type {Object<string, {color: string}>} */
    const globalState = state({})

    component(($) => {
      $.forState(globalState, (item, key) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        $.html`
<div style="color: ${() => item.color}">${() => `${key}:${item.color}`}</div>
`
      })
    }).paint(container)

    // Initially we have no <li> elements
    let div = container.getElementsByTagName('div')[0]

    expect(div).toBe(undefined)

    // Create one <li> element
    globalState.item = { color: 'red' }

    div = container.getElementsByTagName('div')[0]

    expect(div instanceof HTMLDivElement).toBe(true)
    expect(div.textContent).toBe('item:red')
    expect(div.style.color).toBe('red')

    // Change text content
    globalState.item.color = 'blue'
    expect(div.textContent).toBe('item:blue')
    expect(div.style.color).toBe('blue')
  })

  test('(DOM) forState() with fallback handler', () => {
    const container = document.body

    /** @type {string[]} */
    const globalState = state([])

    component(($) => {
      $.ul(
        $.forState(
          globalState,
          (item, key) => {
            $.li(item)
          },
          () => {
            $.li('initial')
          },
        ),
      )
    }).paint(container)

    // Initially we have no <li> elements
    let ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul.childNodes, [
      'forState-begin',
      'initial',
      'forState-end',
    ])

    globalState.push('something')

    ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul.childNodes, [
      'forState-begin',
      'something',
      'forState-end',
    ])

    globalState.pop()

    ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul.childNodes, [
      'forState-begin',
      'initial',
      'forState-end',
    ])

    // Now try when .length is used to clear the array

    globalState.push('something')

    ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul.childNodes, [
      'forState-begin',
      'something',
      'forState-end',
    ])

    globalState.length = 0

    ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul.childNodes, [
      'forState-begin',
      'initial',
      'forState-end',
    ])
  })
})
