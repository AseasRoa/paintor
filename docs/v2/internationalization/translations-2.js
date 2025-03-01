import { compose, template } from 'paintor'

const translationEn = { NOT_TRANSLATED: 'Translated' }

const App = function() {
  return template((x) => {
    x.div('NOT_TRANSLATED')
    x.div({ textContent: 'NOT_TRANSLATED' })
    x.div({ innerText: 'NOT_TRANSLATED' })
    x.div(
      x.input({ type: 'button', value: 'NOT_TRANSLATED' })
    )
    x.html`NOT_TRANSLATED`
    x.html`<div>NOT_TRANSLATED</div>`
    x.html`<input type="button" value="NOT_TRANSLATED" />`
  })
}

compose(App()).useTranslations(translationEn).paint('#translations-2')
