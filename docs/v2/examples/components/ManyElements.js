import { state, template } from 'paintor'

const elements = state([])

function buildData(count, array) {
  array.length = count

  for (let i = count; i > 0; i--) {
    array[count - i] = i
  }
}

function Header(elementsCounts) {
  return template((x) => {
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

      x.$each(elementsCounts, (count) => {
        const idName = `elements-${count}`

        x.div(
          x.input({
            type: 'radio',
            name: 'elements',
            id: idName,
            value: count,
            checked: (count === 0)
          }),
          x.label({for: idName}, count)
        )
      })
    )
  })
}

function ElementsContainer() {
  return template((x) => {
    x.div({id: 'elements-container'},
      x.$each(
        elements,
        (value) => {
          x.span({
            textContent: value,
            style: {width: '46px', height: '46px'},
          })
        },
        () => {
          x.div('No elements')
        }
      )
    )
  })
}

export function ManyElements({ elementCounts }) {
  return template(() => [
      Header(elementCounts),
      ElementsContainer(),
    ]
  )
}
