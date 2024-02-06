import { component, state } from 'paintor'

component(($) => {
  const localState = state([1, 2])

  $.button(
    { onClick: () => localState.push(localState.length + 1) },
    'Add'
  )

  $.ul(
    $.forEach(localState, (value, key) => {
      $.li(
        $.label('key ' + key + ' | value '),
        $.input({ type: 'number', value: value })
      )
    })
  )

}).paint('#using-foreach-add')
