import { compose, state, template } from 'paintor'

const MyComponent = function() {
  return template((x) => {
    const localState = state([])

    function addItem() {
      localState.push('item ' + (localState.length + 1))
    }

    function deleteItem() {
      localState.pop()
    }

    x.button({ onClick: addItem }, 'Add item')
    x.button({ onClick: deleteItem }, 'Remove item')

    x.ul(
      x.$each(
        localState,
        (value) => {
          x.li(value)
        },
        () => {
          x.div('No items')
        }
      )
    )
  })
}

compose(MyComponent()).paint('#using-each-on-empty-state')
