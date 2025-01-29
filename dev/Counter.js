import { state, template } from '#paintor'

export const Counter = () => {
  return template(({ button, div }) => {
    const localState = state({ clicks: 0 })

    div(
      button({ onClick: () => localState.clicks += 1 }, 'Click me'),
      div(() => localState.clicks)
    )
  })
}
