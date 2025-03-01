import { compose, state, template } from 'paintor'

const MyComponent = function() {
  return template((x) => {
    const localState = state([1, 2])

    x.button({
        onClick: () => localState.push(localState.length + 1)
      },
      'Add'
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

compose(MyComponent()).paint('#using-each-add')
