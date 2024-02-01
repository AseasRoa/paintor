import { component, state, template } from 'paintor'

const elements = state([])

function buildData(count, array) {
  array.length = count

  for (let i = count; i > 0; i--) {
    array[count - i] = i
  }
}

const header = template(($) => {
  $.div(
    {
      onClick: (event) => {
        if (!(event.target instanceof HTMLInputElement)) {
          return
        }

        buildData(Number(event.target.value), elements)
      }
    },

    $.input({ type: 'radio', name: 'elements', value: 0 }),
    $.label('0'),

    $.input({ type: 'radio', name: 'elements', value: 1000 }),
    $.label('1,000'),

    $.input({ type: 'radio', name: 'elements', value: 10000 }),
    $.label('10,000'),
  )
})

const manyElements = template(($) => {
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

const toDoComponent = component(
  header,
  manyElements
)

toDoComponent.paint('#many-elements')
