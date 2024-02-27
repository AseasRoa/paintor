import { component, template } from 'paintor'

const profileTemplate = (name, age) => template(
  (x) => {
    x.div({ class: 'profileCard' },
      x.div(x.label('Name: '), x.span(name)),
      x.div(x.label('Age: '), x.span(age))
    )
  }
)

export const ProfileCard = (name, age) => component(
  profileTemplate(name, age)
)
