import { component, template } from '../src/paintor.js'
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
    test('(SSR) Table', () => {
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

    test('(DOM) Table', () => {
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

    test('(SSR) Correct order of elements when automatically calling a Component', () => {
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

    test('(DOM) Correct order of elements when automatically calling a Component', () => {
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

      let ul = container.getElementsByTagName('ul')[0]

      expectTextContentsToBeLike(ul.childNodes, [
        'li-1',
        'li-fragment-1',
        'li-fragment-2',
        'li-2',
        'li-fragment-1',
        'li-fragment-2',
      ])
    })

    test('(SSR) Correct order of elements when automatically calling template functions', () => {
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

    test('(DOM) Correct order of elements when automatically calling template functions', () => {
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

      let ul = container.getElementsByTagName('ul')[0]

      expectTextContentsToBeLike(ul.childNodes, [
        'li-1',
        'li-fragment-1',
        'li-fragment-2',
        'li-2',
        'li-fragment-1',
        'li-fragment-2',
      ])
    })

    test('(SSR) Correct order of elements when manually calling template functions', () => {
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

    test('(DOM) Correct order of elements when manually calling template functions', () => {
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

      let ul = container.getElementsByTagName('ul')[0]

      expectTextContentsToBeLike(ul.childNodes, [
        'li-1',
        'li-fragment-1',
        'li-fragment-2',
        'li-2',
        'li-fragment-1',
        'li-fragment-2',
      ])
    })
  })
})
