import { component, state } from 'paintor'

component((x) => {
  const localState = state([1, 2, 3])

  x.button({
      onClick: () => localState[1] += 1
    },
    'Update Middle'
  )

  x.ul(
    x.forEach(localState, (value, key) => {
      x.li(
        x.label('key ' + key + ' | value '),
        x.input({ type: 'number', value: value })
      )
    })
  )

}).paint('#using-foreach-update')
