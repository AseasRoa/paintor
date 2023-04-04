import { component, state } from '/assets/paintor.js'

component(($) => {
  const localState = state({ number: 0 })

  setInterval(() => {
    localState.number++
  }, 1000)

  $.style(`
    td {
      padding: 0.2rem 1rem;
      border-bottom: 0.1rem solid darkslategray;
    }
  `)

  $.forState(localState, (value, key) => {
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
          $.td('() => localState[key]'),
          $.td(() => localState[key])
        ),
        $.tr(
          $.td(`() => '<' + localState[key] + '>'`),
          $.td(() => '<' + localState[key] + '>')
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
          $.td(`'<' + localState[key] + '>'`),
          $.td('<' + localState[key] + '>')
        )
      )
    )
  })
}).paint('add-remove-elements-example-2')
