import { compose, template } from 'paintor'

const translationEn = { GREETING: 'Hello!', QUESTION: 'How are you today?' }

const App = function() {
  return template((x) => {
    x.div('GREETING', ' ', 'QUESTION')
  })
}

compose(App()).useTranslations(translationEn).paint('#translations-1')
