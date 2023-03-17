import { DOMException } from '../src/SrDOM/exceptions/DOMException.js'
import { Window } from '../src/SrDOM/Window.js'

describe('SrDom Tests', () => {
  describe('window, document', () => {
    let window = new Window()
    let document = window.document

    test('document contains HTML, HTML contains HEAD and BODY', () => {
      const html = document.children[0]

      expect(document.children.length).toBe(1)
      expect(html.tagName).toBe('HTML')
      expect(html.children.length).toBe(2)
      expect(html.children[0].tagName).toBe('HEAD')
      expect(html.children[1].tagName).toBe('BODY')
    })
  })

  describe('Create different types of elements', () => {
    let window = new Window()
    let document = window.document

    // beforeEach(() => {
    //   window = new Window()
    //   document = window.document
    // })

    test('HTMLElement', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      el.textContent = 'Foo'

      expect(el instanceof window.HTMLElement).toBe(true)
      expect(el.tagName).toBe('DIV')
      expect(el.nodeType).toBe(document.ELEMENT_NODE)
      expect(el.nodeName).toBe('DIV')
      expect(el.textContent).toBe('Foo')
    })

    test('DocumentFragment', () => {
      const el = document.createDocumentFragment()
      document.body.appendChild(el)

      expect(el instanceof window.DocumentFragment).toBe(true)
      expect(el.nodeType).toBe(document.DOCUMENT_FRAGMENT_NODE)
      expect(el.nodeName).toBe('#document-fragment')
      expect(el.textContent).toBe('')
    })

    test('Comment', () => {
      const el = document.createComment('Foo')
      document.body.appendChild(el)

      expect(el instanceof window.Comment).toBe(true)
      expect(el.nodeType).toBe(document.COMMENT_NODE)
      expect(el.nodeName).toBe('#comment')
      expect(el.textContent).toBe('Foo')
    })

    test('Text', () => {
      const el = document.createTextNode('Foo')
      document.body.appendChild(el)

      expect(el instanceof window.Text).toBe(true)
      expect(el.nodeType).toBe(document.TEXT_NODE)
      expect(el.nodeName).toBe('#text')
      expect(el.textContent).toBe('Foo')
    })
  })

  describe('Testing appendChild errors', () => {
    let window = new Window()
    let document = window.document

    test('fail on appendChild with wrong input', () => {
      expect(
        // @ts-ignore
        () => document.body.appendChild(123),
      ).toThrowError(TypeError)
    })

    test('fail on attempt to append in Document', () => {
      const el = document.createElement('div')

      // @ts-ignore
      expect(
        () => document.appendChild(el),
      ).toThrowError(DOMException)
    })

    test('fail on attempt to append in Comment element', () => {
      const div = document.createElement('div')
      const comment = document.createComment('Foo')

      expect(
        () => comment.appendChild(div),
      ).toThrowError(window.DOMException)
    })

    test('fail on attempt to append an element into itself', () => {
      const el = document.createElement('button')

      expect(
        () => el.appendChild(el),
      ).toThrowError(window.DOMException)
    })
  })

  describe('Remove elements', () => {
    let window = new Window()
    let document = window.document

    test('HTMlElement', () => {
      const el = document.createElement('button')
      document.body.appendChild(el)
      document.body.appendChild(el) // append more than once should not work

      expect(document.body.childNodes.length).toBe(1)

      el.remove()

      expect(document.body.childNodes.length).toBe(0)
    })
  })
})
