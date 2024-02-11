import { template } from '../node_modules/paintor/lib/index.js'

/**
 * This is the main menu with blue buttons
 *
 * @param {Main} main
 */
export const jumbotron = (main) => template(($) => {
  $.div(
    { class: 'jumbotron' },
    $.div(
      { class: 'row' },
      $.div(
        { class: 'col-md-6' },
        $.h1('Paintor')
      ),
      $.div(
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
        $.div(
          { class: 'row' },
          $.div(
            { class: 'col-sm-6 smallpad' },
            $.button(
              { class: 'btn btn-primary btn-block', id: 'run' },
              'Create 1,000 rows'
            )
          ),
          $.div(
            { class: 'col-sm-6 smallpad' },
            $.button(
              { class: 'btn btn-primary btn-block', id: 'runlots' },
              'Create 10,000 rows'
            )
          ),
          $.div(
            { class: 'col-sm-6 smallpad' },
            $.button(
              { class: 'btn btn-primary btn-block', id: 'add' },
              'Append 1,000 rows'
            )
          ),
          $.div(
            { class: 'col-sm-6 smallpad' },
            $.button(
              { class: 'btn btn-primary btn-block', id: 'update' },
              'Update every 10th row'
            )
          ),
          $.div(
            { class: 'col-sm-6 smallpad' },
            $.button(
              { class: 'btn btn-primary btn-block', id: 'clear' },
              'Clear'
            )
          ),
          $.div(
            { class: 'col-sm-6 smallpad' },
            $.button(
              { class: 'btn btn-primary btn-block', id: 'swaprows' },
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
export const rows = (store) => template(($) => {
  $.table(
    { className: 'table table-hover table-striped test-data' },
    $.tbody(
      $.forEach(
        store.data,
        (item) => row(item, store)($)
      )
    )
  )
})

/**
 * @param {DataItem} item
 * @param {Store} store
 */
const row = (item, store) => template(($) => {
  $.tr(
    {
      // reactive class name
      className: () => (item.id === store.selected.id ? 'danger' : null),
      onClick: (e) => {
        const classList = e.target.classList

        if (classList.contains('lbl')) {
          return store.select(item.id)
        }

        if (classList.contains('remove')) {
          return store.delete(item.id)
        }
      }
    },
    $.td(
      { className: 'col-md-1' },
      item.id
    ),
    $.td(
      { className: 'col-md-4' },
      $.a(
        { className: 'lbl' },
        () => item.label // reactive label
      )
    ),
    $.td(
      { className: 'col-md-1' },
      $.a(
        { className: 'remove' },
        $.span(
          { className: 'remove glyphicon glyphicon-remove', ariaHidden: 'true' }
        )
      )
    ),
    $.td({ className: 'col-md-6' })
  )
})
