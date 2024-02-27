import { component, template } from 'paintor'

const componentOne = component((x) => x.button('1'))
const componentTwo = component((x) => x.button('2'))
const templateOne = template((x) => {
  x.div(
    componentOne,
    componentTwo
  )
})

const componentThree = component((x) => x.button('3'))
const componentFour = component((x) => x.button('4'))
const templateTwo = template((x) => {
  x.div(
    componentThree,
    componentFour
  )
})

const app = component(
  templateOne,
  templateTwo
)

app.paint('#components-1')
