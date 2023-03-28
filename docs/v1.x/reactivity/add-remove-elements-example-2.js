import { compose, createState } from '/assets/paintor.js'

const state = createState({ number: 0 })

setInterval(() => {
  state.number++
}, 1000)

compose(($) => {
  $.style(`
    td {
      padding: 0.2rem 1rem;
      border-bottom: 0.1rem solid darkslategray;
    }
  `)

  $.forState(state, (value, key) => {
    $.table(
      $.thead(
        $.tr(
          $.td('Variant'),
          $.td('Result')
        )
      ),
      $.tbody(
        $.tr(
          $.td('value'),
          $.td(value),
        ),
        $.tr(
          $.td(`'<' + value + '>'`),
          $.td('<' + value + '>'),
        ),
        $.tr(
          $.td('() => value()'),
          $.td(() => value())
        ),
        $.tr(
          $.td(`() => '<' + value() + '>'`),
          $.td(() => '<' + value() + '>')
        ),
        $.tr(
          $.td('() => state[key]'),
          $.td(() => state[key])
        ),
        $.tr(
          $.td(`() => '<' + state[key] + '>'`),
          $.td(() => '<' + state[key] + '>')
        ),
        $.tr(
          $.td('value()'),
          $.td(value())
        ),
        $.tr(
          $.td(`'<' + value() + '>'`),
          $.td('<' + value() + '>')
        ),
        $.tr(
          $.td('() => value'),
          $.td(() => value)
        ),
        $.tr(
          $.td(`() => '<' + value + '>'`),
          $.td(() => '<' + value + '>')
        ),
        $.tr(
          $.td(`'<' + state[key] + '>'`),
          $.td('<' + state[key] + '>')
        )
      )
    )
  })
}).paint('add-remove-elements-example-2')
