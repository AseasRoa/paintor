import { component, state, template } from 'paintor'

const elements = state([])

function buildData(count, array) {
  array.length = count

  for (let i = count; i > 0; i--) {
    array[count - i] = i
  }
}

const header = (elementsCounts) => template((x) => {
  x.div(
    {
      onClick: (event) => {
        if (!(event.target instanceof HTMLInputElement)) {
          return
        }

        buildData(Number(event.target.value), elements)
      }
    },

    x.h3('How many elements to draw?'),

    x.forEach(elementsCounts, (count) => {
      const idName = `elements-${count}`

      x.div(
        x.input({
          type: 'radio',
          name: 'elements',
          id: idName,
          value: count,
          checked: (count === 0)
        }),
        x.label({ for: idName }, count)
      )

    })
  )
})

const elementsContainer = template((x) => {
  x.div({ id: 'elements-container' },
    x.forEach(
      elements,
      (value) => {
        x.span({
          textContent: value,
          style: { width: '46px', height: '46px' },
        })
      },
      () => {
        x.div('No elements')
      }
    )
  )
})

const ManyElements = (elementsCounts) => component(
  header(elementsCounts),
  elementsContainer
)

export { ManyElements }
