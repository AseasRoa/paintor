import { component, template } from '/assets/paintor.js'

const componentOne = component(($) => $.button('1'))
const componentTwo = component(($) => $.button('2'))
const templateOne = template(($) => {
  $.div(
    componentOne,
    componentTwo
  )
})

const componentThree = component(($) => $.button('3'))
const componentFour = component(($) => $.button('4'))
const templateTwo = template(($) => {
  $.div(
    componentThree,
    componentFour
  )
})

const app = component(
  templateOne,
  templateTwo
)

app.paint('components-in-templates')
