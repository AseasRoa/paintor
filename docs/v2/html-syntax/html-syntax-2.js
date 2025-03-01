import { compose, template } from 'paintor'

const translationEn = { GREETING: 'Hello' }

const Greeting = function() {
  return template((x) => {
    x.$html`<div>GREETING</div>`
  })
}

compose(Greeting()).useTranslations(translationEn).paint('#html-syntax-2')
