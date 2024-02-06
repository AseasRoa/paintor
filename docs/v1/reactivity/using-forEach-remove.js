import { component, state } from 'paintor'

component(($) => {
  const localState = state([1, 2, 3])

  $.button(
    { onClick: () => localState.push(localState.length + 1) },
    'Add'
  )

  $.button(
    { onClick: () => localState.shift() },
    'Remove (shift))'
  )

  $.button(
    { onClick: () => localState.pop() },
    'Remove (pop)'
  )

  $.ul(
    $.forEach(localState, (value, key) => {
      $.li(
        $.label('key ' + key + ' | value '),
        $.input({ type: 'number', value: value })
      )
    })
  )

}).paint('#using-foreach-remove')
