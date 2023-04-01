import { compose, createState, createTemplate } from '/assets/paintor.js'

const componentOne = compose(($) => $.button('1'))
const componentTwo = compose(($) => $.button('2'))
const templateOne = createTemplate(($) => {
  $.div(
    componentOne,
    componentTwo
  )
})

const componentThree = compose(($) => $.button('3'))
const componentFour = compose(($) => $.button('4'))
const templateTwo = createTemplate(($) => {
  $.div(
    componentThree,
    componentFour
  )
})

const app = compose(
  templateOne,
  templateTwo
)

app.paint('components-in-templates')
