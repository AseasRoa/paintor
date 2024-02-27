import { component } from 'paintor'

const translationEn = { GREETING: 'Hello' }

component((x) => {
  x.html`<div>GREETING</div>`
}).useTranslations(translationEn).paint('#html-syntax-2')
