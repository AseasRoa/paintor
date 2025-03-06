import { css, state, template } from '#paintor'

export const Counter = () => {
  //css(`button{color:red}`)

  return template(({ $css, button, div }) => {
    $css(`button{color:red}`)
    const localState = state({ clicks: 0 })

    div({ className: 'class' },
      button({ onClick: () => localState.clicks += 1 }, 'Click me'),
      div(() => localState.clicks)
    )
  })
}
