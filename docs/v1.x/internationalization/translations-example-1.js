import { compose } from '/assets/paintor.js'

const translationEn = { GREETING: 'Hello!', QUESTION: 'How are you today?' }

compose(($) => {
  $.div('GREETING', ' ', 'QUESTION')
}).useTranslations(translationEn).paint('translations-example-1')
