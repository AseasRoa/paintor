import { compose, state, template } from 'paintor'

const MyComponent = function() {
  return template((x) => {
    const localState = state([1, 2, 3])

    x.button({
        onClick: () => localState[1] += 1
      },
      'Update Middle'
    )

    x.ul(
      x.$each(localState, (value, key) => {
        x.li(
          x.label('key ' + key + ' | value '),
          x.input({ type: 'number', value: value })
        )
      })
    )
  })
}

compose(MyComponent()).paint('#using-each-update')
