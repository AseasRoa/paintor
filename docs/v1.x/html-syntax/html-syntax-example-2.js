import { component } from '/assets/paintor.js'

const translationEn = { GREETING: 'Hello' }

component(($) => {
  $.html`<div>GREETING</div>`
}).useTranslations(translationEn).paint('html-syntax-example-2')
