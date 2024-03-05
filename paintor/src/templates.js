import { template } from '../node_modules/paintor/lib/index.js'

/**
 * This is the main menu with blue buttons
 *
 * @param {Main} main
 */
export const jumbotron = (main) => template((x) => {
  x.div({ class: 'jumbotron' },
    x.div({ class: 'row' },
      x.div({ class: 'col-md-6' },
        x.h1('Paintor')
      ),
      x.div(
        {
          class: 'col-md-6',
          onClick: (e) => {
            e.preventDefault()
            const id = e.target.id

            switch(id) {
              case 'run': return main.run()
              case 'runlots': return main.runLots()
              case 'add': return main.add()
              case 'update': return main.update()
              case 'clear': return main.clear()
              case 'swaprows': return main.swapRows()
            }
          }
        },
        x.div({ class: 'row' },
          x.div({ class: 'col-sm-6 smallpad' },
            x.button({ class: 'btn btn-primary btn-block', id: 'run' },
              'Create 1,000 rows'
            )
          ),
          x.div({ class: 'col-sm-6 smallpad' },
            x.button({ class: 'btn btn-primary btn-block', id: 'runlots' },
              'Create 10,000 rows'
            )
          ),
          x.div({ class: 'col-sm-6 smallpad' },
            x.button({ class: 'btn btn-primary btn-block', id: 'add' },
              'Append 1,000 rows'
            )
          ),
          x.div({ class: 'col-sm-6 smallpad' },
            x.button({ class: 'btn btn-primary btn-block', id: 'update' },
              'Update every 10th row'
            )
          ),
          x.div({ class: 'col-sm-6 smallpad' },
            x.button({ class: 'btn btn-primary btn-block', id: 'clear' },
              'Clear'
            )
          ),
          x.div({ class: 'col-sm-6 smallpad' },
            x.button({ class: 'btn btn-primary btn-block', id: 'swaprows' },
              'Swap Rows'
            )
          )
        )
      )
    )
  )
})

/**
 * @param {Store} store
 */
export const rows = (store) => template((x) => {
  x.table({ className: 'table table-hover table-striped test-data' },
    x.tbody(
      x.forEach(store.data, (item) => row(item, store))
    )
  )
})

/**
 * @param {DataItem} item
 * @param {Store} store
 */
const row = (item, store) => template((x) => {
  const { id } = item

  /**
   * @param {MouseEvent} event
   */
  function selectRow(event) {
    const classList = event.target.classList

    if (classList.contains('lbl'))
      store.select(id)
    else if (classList.contains('remove'))
      store.delete(id)
  }

  x.tr(
    {
      className: () => (id === store.selected.id ? 'danger' : null), /* reactive class name */
      onClick: selectRow
    },
    x.td({ className: 'col-md-1' }, id),
    x.td({ className: 'col-md-4' },
      x.a({ className: 'lbl' }, () => (item.label)) /* reactive label */
    ),
    x.td({ className: 'col-md-1' },
      x.a({ className: 'remove' },
        x.span({ className: 'remove glyphicon glyphicon-remove', ariaHidden: 'true' })
      )
    ),
    x.td({ className: 'col-md-6' })
  )
})
