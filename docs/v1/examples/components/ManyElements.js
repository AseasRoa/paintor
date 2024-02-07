import { component, state, template } from 'paintor'

const elements = state([])

function buildData(count, array) {
  array.length = count

  for (let i = count; i > 0; i--) {
    array[count - i] = i
  }
}

const header = (elementsCounts) => template(($) => {
  $.div(
    {
      onClick: (event) => {
        if (!(event.target instanceof HTMLInputElement)) {
          return
        }

        buildData(Number(event.target.value), elements)
      }
    },

    $.h3('How many elements to draw?'),

    $.forEach(elementsCounts, (count) => {
      const idName = `elements-${count}`

      $.div(
        $.input({
          type: 'radio',
          name: 'elements',
          id: idName,
          value: count,
          checked: (count === 0)
        }),
        $.label({ for: idName }, count)
      )

    })
  )
})

const elementsContainer = template(($) => {
  $.div(
    { id: 'elements-container' },

    $.forEach(
      elements,
      (value) => {
        $.span({
          textContent: value,
          style: { width: '46px', height: '46px' },
        })
      },
      () => {
        $.div('No elements')
      }
    )
  )
})

const ManyElements = (elementsCounts) => component(
  header(elementsCounts),
  elementsContainer
)

export { ManyElements }
