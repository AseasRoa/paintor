import { component, state } from 'paintor'

component(($) => {
  const localState = state([1, 2, 3])

  $.button(
    { onClick: () => localState[1] += 1 },
    'Update Middle'
  )

  $.ul(
    $.forEach(localState, (value, key) => {
      $.li(
        $.label('key ' + key + ' | value '),
        $.input({ type: 'number', value: value })
      )
    })
  )

}).paint('#using-foreach-update')
