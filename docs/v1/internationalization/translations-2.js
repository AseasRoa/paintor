import { component } from 'paintor'

const translationEn = { NOT_TRANSLATED: 'Translated' }

component(($) => {
  $.div('NOT_TRANSLATED')
  $.div({ textContent: 'NOT_TRANSLATED' })
  $.div({ innerText: 'NOT_TRANSLATED' })
  $.div(
    $.input({ type: 'button', value: 'NOT_TRANSLATED' })
  )
  $.html`NOT_TRANSLATED`
  $.html`<div>NOT_TRANSLATED</div>`
  $.html`<input type="button" value="NOT_TRANSLATED" />`
}).useTranslations(translationEn).paint('#translations-2')
