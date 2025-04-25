import { css, state, template } from '#paintor'

export const Counter = () => {
  // css(`button { color: red; }`)

  return template((x) => {
    x.$css('button { color: red; }')

    const localState = state({ clicks: 0 })

    x.div({ className: 'class' },
      x.button({ onClick: () => localState.clicks += 1 }, 'Click me'),
      x.div(() => localState.clicks)
    )
  })
}
