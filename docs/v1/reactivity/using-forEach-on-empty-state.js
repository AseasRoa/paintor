import { component, state } from 'paintor'

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
    $.forEach(
      localState,
      (value) => {
        $.li(value)
      },
      () => {
        $.div('No items')
      }
    )
  )
}).paint('#using-foreach-on-empty-state')
