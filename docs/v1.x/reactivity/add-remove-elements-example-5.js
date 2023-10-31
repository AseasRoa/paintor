import { component, state } from '/assets/paintor.js'

component(($) => {
  const localState = state([])

  function addItem() {
    localState.push('item ' + (localState.length + 1))
  }

  function deleteItem() {
    localState.pop()
  }

  $.button({ onClick: addItem }, 'Add item')
  $.button({ onClick: deleteItem }, 'Remove item')

  $.ul(
    $.forState(
      localState,
      (value) => {
        console.log(value)
        $.li(value)
      },
      () => {
        $.div('No items')
      }
    )
  )

}).paint('add-remove-elements-example-5')
