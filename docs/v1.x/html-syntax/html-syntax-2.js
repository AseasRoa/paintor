import { component } from 'paintor'

const translationEn = { GREETING: 'Hello' }

component(($) => {
  $.html`<div>GREETING</div>`
}).useTranslations(translationEn).paint('html-syntax-2')
