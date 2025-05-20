/* eslint-disable vitest/expect-expect */

import { beforeEach, describe, expect, test } from 'vitest'
import { expectTextContentsToBeLike } from './functions.js'
import { compose, state, template } from '#paintor'

describe('Elements Creation', () => {
  const id = 'container'

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Destructured method names', () => {
    test('(SSR) Destructured template tree', () => {
      const html = compose(({ a, button, div }) => {
        a('a')
        button('button')
        div('div')
      }).html()

      expect(html).toBe('<a>a</a><button>button</button><div>div</div>')
    })

    test('(DOM) Destructured template tree', () => {
      const container = document.createElement('div')
      container.id = id
      document.body.appendChild(container)

      const App = function() {
        return template(({ a, button, div }) => {
          a('a')
          button('button')
          div('div')
        })
      }

      compose(App()).paint(container)

      const elements = container.querySelectorAll('*')

      expectTextContentsToBeLike(elements, ['a', 'button', 'div',])
    })
  })

  describe('Paint in elements, selected in different ways', () => {
    const App = function() {
      return template((x) => {
        x.div('div 1')
        x.div('div 2')
        x.div('div 3')
      })
    }

    test('(SSR) 3 divs', () => {
      const html = compose(App()).html()

      expect(html).toBe('<div>div 1</div><div>div 2</div><div>div 3</div>')
    })

    test('(DOM) 3 divs, element is Element', () => {
      const container = document.createElement('div')
      container.id = id
      document.body.appendChild(container)

      compose(App()).paint(container)

      expect(container.childNodes.length).toBe(3)
    })

    test('(DOM) 3 divs, element queried by Id', () => {
      const container = document.createElement('div')
      container.id = id
      document.body.appendChild(container)

      compose(App()).paint(`#${id}`)

      expect(container.childNodes.length).toBe(3)
    })

    test('(DOM) 3 divs, element is a Custom Element', () => {
      const container = document.createElement('compose-element')
      document.body.appendChild(container)

      compose(App()).paint('compose-element')

      expect(container.shadowRoot?.children.length).toBe(3)
    })
  })

  describe('Check Order of Rendered Elements', () => {
    describe('Table', () => {
      const App = function() {
        return template((x) => {
          x.table(
            x.tr(
              x.td('Row 1, Column 1'),
              x.td('Row 1, Column 2'),
            ),
            x.tr(
              x.td('Row 2, Column 1'),
              x.td('Row 2, Column 2'),
            ),
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe('<table><tr><td>Row 1, Column 1</td><td>Row 1, Column 2</td></tr><tr><td>Row 2, Column 1</td><td>Row 2, Column 2</td></tr></table>')
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        const table = container.children[0]

        expect(container.children.length).toBe(1)
        expect(table?.tagName).toBe('TABLE')

        expect(table?.children.length).toBe(2)
        expect(table?.children[0]?.tagName).toBe('TR')
        expect(table?.children[1]?.tagName).toBe('TR')

        expect(table?.children[0]?.children.length).toBe(2)
        expect(table?.children[0]?.children[0]?.tagName).toBe('TD')
        expect(table?.children[0]?.children[0]?.children.length).toBe(0)
        expect(table?.children[0]?.children[0]?.textContent).toBe('Row 1, Column 1')
        expect(table?.children[0]?.children[1]?.tagName).toBe('TD')
        expect(table?.children[0]?.children[1]?.children.length).toBe(0)
        expect(table?.children[0]?.children[1]?.textContent).toBe('Row 1, Column 2')

        expect(table?.children[1]?.children.length).toBe(2)
        expect(table?.children[1]?.children[0]?.tagName).toBe('TD')
        expect(table?.children[1]?.children[0]?.children.length).toBe(0)
        expect(table?.children[1]?.children[0]?.textContent).toBe('Row 2, Column 1')
        expect(table?.children[1]?.children[1]?.tagName).toBe('TD')
        expect(table?.children[1]?.children[1]?.children.length).toBe(0)
        expect(table?.children[1]?.children[1]?.textContent).toBe('Row 2, Column 2')
      })
    })

    describe('Passing element in a component, which returns it', () => {
      /**
       * @param {HTMLElement} element
       * @returns {Template}
       */
      function Component(element) {
        return template(() => {
          return element
        })
      }

      const App = function() {
        return template((x) => {
          const li2 = x.li('li-2')

          x.ul(
            x.li('li-1'),
            Component(li2),
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe('<ul><li>li-1</li><li>li-2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        const ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'li-1',
          'li-2',
        ])
      })
    })

    describe('Passing element in a component', () => {
      /**
       * @param {HTMLElement} element
       * @returns {Template}
       */
      function Component(element) {
        return template((x) => {
          return x.ul(
            x.li('li-1'),
            element,
          )
        })
      }

      const App = function() {
        return template((x) => {
          const li2 = x.li('li-2')

          x.div(
            Component(li2)
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe('<div><ul><li>li-1</li><li>li-2</li></ul></div>')
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        const div = container?.getElementsByTagName('div')[0]
        const ul = div?.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'li-1',
          'li-2',
        ])
      })
    })

    describe('Automatically calling template functions', () => {
      const liFragments = template((x) => {
        x.li('li-fragment-1')
        x.li('li-fragment-2')
      })

      const App = function() {
        return template((x) => {
          x.ul(
            x.li('li-1'),
            liFragments,
            x.li('li-2'),
            liFragments,
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe('<ul><li>li-1</li><li>li-fragment-1</li><li>li-fragment-2</li><li>li-2</li><li>li-fragment-1</li><li>li-fragment-2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        const ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'li-1',
          'li-fragment-1',
          'li-fragment-2',
          'li-2',
          'li-fragment-1',
          'li-fragment-2',
        ])
      })
    })

    describe('Manually calling template functions', () => {
      const liFragments = (x) => {
        x.li('li-fragment-1')
        x.li('li-fragment-2')
      }

      const App = function() {
        return template((x) => {
          x.ul(
            x.li('li-1'),
            liFragments(x),
            x.li('li-2'),
            liFragments(x),
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe('<ul><li>li-1</li><li>li-fragment-1</li><li>li-fragment-2</li><li>li-2</li><li>li-fragment-1</li><li>li-fragment-2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        const ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'li-1',
          'li-fragment-1',
          'li-fragment-2',
          'li-2',
          'li-fragment-1',
          'li-fragment-2',
        ])
      })
    })

    describe('Using $each() with normal array', () => {
      const array = ['1', '2']

      const liFragments = (x) => {
        x.li('li-fragment-1')
        x.li('li-fragment-2')
      }

      const App = function() {
        return template((x) => {
          x.ul(
            x.$each(array, (value) => {
              x.li(`li-${value}`)
              liFragments(x)
            }),
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe('<ul><li>li-1</li><li>li-fragment-1</li><li>li-fragment-2</li><li>li-2</li><li>li-fragment-1</li><li>li-fragment-2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        const ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'li-1',
          'li-fragment-1',
          'li-fragment-2',
          'li-2',
          'li-fragment-1',
          'li-fragment-2'
        ])
      })
    })

    describe('Using $each() with normal array, breaking the loop', () => {
      const array = ['1', '2', '3', '4']

      const App = function() {
        return template((x) => {
          x.ul(
            x.$each(array, (value, key) => {
              if (key === '2') return false

              return x.li(value)
            })
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe('<ul><li>1</li><li>2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        const ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, ['1', '2'])
      })
    })

    describe('Using $each() with reactive state', () => {
      const globalState = state(['1', '2'])

      const liFragments = (x) => {
        x.li('li-fragment-1')
        x.li('li-fragment-2')
      }

      const App = function() {
        return template((x) => {
          x.ul(
            x.$each(globalState, (value) => {
              x.li(`li-${value}`)
              liFragments(x)
            })
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe('<ul><!--reactive-begin--><li>li-1</li><li>li-fragment-1</li><li>li-fragment-2</li><li>li-2</li><li>li-fragment-1</li><li>li-fragment-2</li><!--reactive-end--></ul>')
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        const ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'reactive-begin',
          'li-1',
          'li-fragment-1',
          'li-fragment-2',
          'li-2',
          'li-fragment-1',
          'li-fragment-2',
          'reactive-end',
        ])
      })
    })

    describe('if() with a callback, returning a Template', () => {
      const ifCallback = template((x) => {
        x.li('if')
      })
      const elseCallback = template((x) => {
        x.li('else')
      })

      const App = function() {
        return template((x) => {
          x.ul(
            x.$if(true, ifCallback, elseCallback),
          )
          x.ul(
            x.$if(false, ifCallback, elseCallback),
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe(
          '<ul><li>if</li></ul>'
          + '<ul><li>else</li></ul>',
        )
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        let ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'if',
        ])

        ul = container.getElementsByTagName('ul')[1]

        expectTextContentsToBeLike(ul?.childNodes, [
          'else',
        ])
      })
    })

    describe('$each() with a callback, returning a Template', () => {
      const array = ['1', '2']
      const globalState = state(['1', '2'])

      /**
       * @param {string} value
       * @returns {Template}
       */
      const callback = (value) => template((x) => {
        x.li(`li-${value}`)
      })

      const App = function() {
        return template((x) => {
          x.ul(
            x.$each(array, callback),
          )

          x.ul(
            x.$each(globalState, callback),
          )
        })
      }

      test('SSR', () => {
        const html = compose(App()).html()

        expect(html).toBe(
          '<ul><li>li-1</li><li>li-2</li></ul>'
          + '<ul><!--reactive-begin--><li>li-1</li><li>li-2</li><!--reactive-end--></ul>'
        )
      })

      test('DOM', () => {
        const container = document.body

        compose(App()).paint(container)

        let ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'li-1',
          'li-2',
        ])

        ul = container.getElementsByTagName('ul')[1]

        expectTextContentsToBeLike(ul?.childNodes, [
          'reactive-begin',
          'li-1',
          'li-2',
          'reactive-end',
        ])
      })
    })
  })

  describe('Static HTML', () => {
    const App = function() {
      let counter = 0

      return template((x) => {
        x.div(counter)
        counter += 1
      })
    }

    test('(SSR) staticHtml()', () => {
      const app = compose(App())

      for (let i = 0; i < 6; i++) {
        const staticHtml = app.staticHtml()
        const dynamicHtml = app.html()

        expect(staticHtml).toBe('<div>0</div>')
        expect(dynamicHtml).toBe(`<div>${i + 1}</div>`)
      }
    })

    test('(SSR) static(true)', () => {
      const app = compose(App())

      app.static()
      expect(app.html()).toBe('<div>0</div>')
      expect(app.html()).toBe('<div>0</div>')
      expect(app.html()).toBe('<div>0</div>')

      app.static(false)
      expect(app.html()).toBe('<div>1</div>')
      expect(app.html()).toBe('<div>2</div>')
      expect(app.html()).toBe('<div>3</div>')

      app.static()
      expect(app.html()).toBe('<div>4</div>')
      expect(app.html()).toBe('<div>4</div>')
      expect(app.html()).toBe('<div>4</div>')

      app.static(false)
      expect(app.html()).toBe('<div>5</div>')
      app.static()
      expect(app.html()).toBe('<div>6</div>')
      app.static(false)
      expect(app.html()).toBe('<div>7</div>')
      app.static()
      expect(app.html()).toBe('<div>8</div>')
    })
  })
})
