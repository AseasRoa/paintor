import { compose } from '/assets/paintor.js'

compose(($) => {
  $.h1('h1 element')
  $.h2('h2 element')
  $.h3('h3 element')
}).paint('custom-container')

compose(($) => {
  $.html(`
    <h1>h1 element</h1>
    <h2>h2 element</h2>
    <h3>h3 element</h3>
   `)
}).paint('custom-container-2')
