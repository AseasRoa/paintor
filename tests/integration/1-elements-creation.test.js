/* eslint-disable vitest/expect-expect */

import { component, state, template } from '#paintor'
import { expectTextContentsToBeLike } from './functions.js'

describe('Elements Creation', () => {
  const id = 'container'

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Paint in elements, selected in different ways', () => {
    test('(SSR) 3 divs', () => {
      const html = component(($) => {
        $.div('div 1')
        $.div('div 2')
        $.div('div 3')
      }).html()

      expect(html).toBe('<div>div 1</div><div>div 2</div><div>div 3</div>')
    })

    test('(DOM) 3 divs, element is Element', () => {
      const container = document.createElement('div')
      container.id = id
      document.body.appendChild(container)

      component(($) => {
        $.div('div 1')
        $.div('div 2')
        $.div('div 3')
      }).paint(container)

      expect(container.childNodes.length).toBe(3)
    })

    test('(DOM) 3 divs, element queried by Id', () => {
      const container = document.createElement('div')
      container.id = id
      document.body.appendChild(container)

      component(($) => {
        $.div('div 1')
        $.div('div 2')
        $.div('div 3')
      }).paint(`#${id}`)

      expect(container.childNodes.length).toBe(3)
    })

    test('(DOM) 3 divs, element is a Custom Element', () => {
      const container = document.createElement('component-element')
      document.body.appendChild(container)

      component(($) => {
        $.div('div 1')
        $.div('div 2')
        $.div('div 3')
      }).paint('component-element')

      expect(container.shadowRoot?.children.length).toBe(3)
    })
  })

  describe('Check Order of Rendered Elements', () => {
    describe('Table', () => {
      test('SSR', () => {
        const html = component(($) => {
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
        }).html()

        expect(html).toBe('<table><tr><td>Row 1, Column 1</td><td>Row 1, Column 2</td></tr><tr><td>Row 2, Column 1</td><td>Row 2, Column 2</td></tr></table>')
      })

      test('DOM', () => {
        const container = document.body

        component(($) => {
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

    describe('Automatically calling a Component', () => {
      test('SSR', () => {
        const liFragments = component(($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        })

        const html = component(($) => {
          $.ul(
            $.li('li-1'),
            liFragments,
            $.li('li-2'),
            liFragments,
          )
        }).html()

        expect(html).toBe('<ul><li>li-1</li><li>li-fragment-1</li><li>li-fragment-2</li><li>li-2</li><li>li-fragment-1</li><li>li-fragment-2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body

        const liFragments = component(($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        })

        component(($) => {
          $.ul(
            $.li('li-1'),
            liFragments,
            $.li('li-2'),
            liFragments,
          )
        }).paint(container)

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

    describe('Automatically calling template functions', () => {
      test('SSR', () => {
        const liFragments = template(($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        })

        const html = component(($) => {
          $.ul(
            $.li('li-1'),
            liFragments,
            $.li('li-2'),
            liFragments,
          )
        }).html()

        expect(html).toBe('<ul><li>li-1</li><li>li-fragment-1</li><li>li-fragment-2</li><li>li-2</li><li>li-fragment-1</li><li>li-fragment-2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body

        const liFragments = template(($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        })

        component(($) => {
          $.ul(
            $.li('li-1'),
            liFragments,
            $.li('li-2'),
            liFragments,
          )
        }).paint(container)

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
      test('SSR', () => {
        /**
         * Template function, created without the wrapper
         *
         * @param {TemplateTree} $
         */
        const liFragments = ($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        }

        const html = component(($) => {
          $.ul(
            $.li('li-1'),
            liFragments($),
            $.li('li-2'),
            liFragments($),
          )
        }).html()

        expect(html).toBe('<ul><li>li-1</li><li>li-fragment-1</li><li>li-fragment-2</li><li>li-2</li><li>li-fragment-1</li><li>li-fragment-2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body

        /**
         * Template function, created without the wrapper
         *
         * @param {TemplateTree} $
         */
        const liFragments = ($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        }

        component(($) => {
          $.ul(
            $.li('li-1'),
            liFragments($),
            $.li('li-2'),
            liFragments($),
          )
        }).paint(container)

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

    describe('Using forEach() with normal array', () => {
      test('SSR', () => {
        const array = ['1', '2']

        /**
         * Template function, created without the wrapper
         *
         * @param {TemplateTree} $
         */
        const liFragments = ($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        }

        const html = component(($) => {
          $.ul(
            $.forEach(array, (value) => {
              $.li('li-' + value)
              liFragments($)
            }),
          )
        }).html()

        expect(html).toBe('<ul><li>li-1</li><li>li-fragment-1</li><li>li-fragment-2</li><li>li-2</li><li>li-fragment-1</li><li>li-fragment-2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body
        const array = ['1', '2']

        /**
         * Template function, created without the wrapper
         *
         * @param {TemplateTree} $
         */
        const liFragments = ($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        }

        component(($) => {
          $.ul(
            $.forEach(array, (value) => {
              $.li('li-' + value)
              liFragments($)
            }),
          )
        }).paint(container)

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

    describe('Using forEach() with normal array, breaking the loop', () => {
      test('SSR', () => {
        const array = ['1', '2', '3', '4']

        const html = component(($) => {
          $.ul(
            $.forEach(array, (value, key) => {
              if (key === '2') return false

              return $.li(value)
            })
          )
        }).html()

        expect(html).toBe('<ul><li>1</li><li>2</li></ul>')
      })

      test('DOM', () => {
        const container = document.body
        const array = ['1', '2', '3', '4']

        component(($) => {
          $.ul(
            $.forEach(array, (value, key) => {
              if (key === '2') return false

              return $.li(value)
            })
          )
        }).paint(container)

        const ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, ['1', '2'])
      })
    })

    describe('Using forEach() with reactive state', () => {
      test('SSR', () => {
        const globalState = state(['1', '2'])

        /**
         * Template function, created without the wrapper
         *
         * @param {TemplateTree} $
         */
        const liFragments = ($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        }

        const html = component(($) => {
          $.ul(
            $.forEach(globalState, (value) => {
              $.li('li-' + value)
              liFragments($)
            }),
          )
        }).html()

        expect(html).toBe('<ul><!--reactive-begin--><li>li-1</li><li>li-fragment-1</li><li>li-fragment-2</li><li>li-2</li><li>li-fragment-1</li><li>li-fragment-2</li><!--reactive-end--></ul>')
      })

      test('DOM', () => {
        const container = document.body
        const globalState = state(['1', '2'])

        /**
         * Template function, created without the wrapper
         *
         * @param {TemplateTree} $
         */
        const liFragments = ($) => {
          $.li('li-fragment-1')
          $.li('li-fragment-2')
        }

        component(($) => {
          $.ul(
            $.forEach(globalState, (value) => {
              $.li('li-' + value)
              liFragments($)
            }),
          )
        }).paint(container)

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
      test('SSR', () => {
        const ifCallback = template(($) => {
          $.li('if')
        })
        const elseCallback = template(($) => {
          $.li('else')
        })

        const html = component(($) => {
          $.ul(
            $.if(true, ifCallback, elseCallback),
          )

          $.ul(
            $.if(false, ifCallback, elseCallback),
          )
        }).html()

        expect(html).toBe(
          '<ul><li>if</li></ul>'
          + '<ul><li>else</li></ul>',
        )
      })

      test('DOM', () => {
        const container = document.body

        const ifCallback = template(($) => {
          $.li('if')
        })
        const elseCallback = template(($) => {
          $.li('else')
        })

        component(($) => {
          $.ul(
            $.if(true, ifCallback, elseCallback),
          )

          $.ul(
            $.if(false, ifCallback, elseCallback),
          )
        }).paint(container)

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

    describe('forEach() with a callback, returning a Template', () => {
      test('SSR', () => {
        const array = ['1', '2']
        const globalState = state(['1', '2'])

        /**
         * @param {string} value
         * @returns {Template}
         */
        const callback = (value) => template(($) => {
          $.li('li-' + value)
        })

        const html = component(($) => {
          $.ul(
            $.forEach(array, callback),
          )

          $.ul(
            $.forEach(globalState, callback),
          )
        }).html()

        expect(html).toBe(
          '<ul><li>li-1</li><li>li-2</li></ul>'
          + '<ul><!--reactive-begin--><li>li-1</li><li>li-2</li><!--reactive-end--></ul>'
        )
      })

      test('DOM', () => {
        const container = document.body
        const array = ['1', '2']
        const globalState = state(['1', '2'])

        /**
         * @param {string} value
         * @returns {Template}
         */
        const callback = (value) => template(($) => {
          $.li('li-' + value)
        })

        component(($) => {
          $.ul(
            $.forEach(array, callback),
          )

          $.ul(
            $.forEach(globalState, callback),
          )
        }).paint(container)

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

    describe('forEach() with a callback, returning a Component', () => {
      test('SSR', () => {
        const globalState = state(['1', '2'])

        /**
         * @param {string} value
         * @returns {Component}
         */
        const callback = (value) => component(($) => {
          $.li('li-' + value)
        })

        const html = component(($) => {
          $.ul(
            $.forEach(globalState, callback),
          )
        }).html()

        expect(html).toBe('<ul><!--reactive-begin--><li>li-1</li><li>li-2</li><!--reactive-end--></ul>')
      })

      test('DOM', () => {
        const container = document.body
        const globalState = state(['1', '2'])

        /**
         * @param {string} value
         * @returns {Component}
         */
        const callback = (value) => component(($) => {
          $.li('li-' + value)
        })

        component(($) => {
          $.ul(
            $.forEach(globalState, callback),
          )
        }).paint(container)

        const ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'reactive-begin',
          'li-1',
          'li-2',
          'reactive-end',
        ])
      })
    })
  })

  describe('Destructured method names', () => {
    test('(SSR) destructured template tree', () => {
      const html = component(({ a, button, div }) => {
        a('a')
        button('button')
        div('div')
      }).html()

      expect(html).toBe('<a>a</a><button>button</button><div>div</div>')
    })

    test('(DOM) destructured template tree', () => {
      const container = document.createElement('div')
      container.id = id
      document.body.appendChild(container)

      component(({ a, button, div }) => {
        a('a')
        button('button')
        div('div')
      }).paint(container)

      const elements = container.querySelectorAll('*')

      expectTextContentsToBeLike(elements, ['a', 'button', 'div',])
    })
  })
})
