import { component, state } from 'paintor'

component((x) => {
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
    x.forEach(
      localState,
      (value) => {
        x.li(value)
      },
      () => {
        x.div('No items')
      }
    )
  )
}).paint('#using-foreach-on-empty-state')
