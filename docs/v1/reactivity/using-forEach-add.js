import { component, state } from 'paintor'

component((x) => {
  const localState = state([1, 2])

  x.button({
      onClick: () => localState.push(localState.length + 1)
    },
    'Add'
  )

  x.ul(
    x.forEach(localState, (value, key) => {
      x.li(
        x.label('key ' + key + ' | value '),
        x.input({ type: 'number', value: value })
      )
    })
  )

}).paint('#using-foreach-add')
