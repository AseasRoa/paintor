import { component } from 'paintor'

const translationEn = { GREETING: 'Hello!', QUESTION: 'How are you today?' }

component((x) => {
  x.div('GREETING', ' ', 'QUESTION')
}).useTranslations(translationEn).paint('#translations-1')