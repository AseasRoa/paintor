import { compose } from '/assets/paintor.js'

const translationEn = { GREETING: 'Hello' }

compose(($) => {
  $.html`<div>GREETING</div>`
}).useTranslations(translationEn).paint('html-syntax-example-2')
