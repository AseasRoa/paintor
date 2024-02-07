import { component, template } from 'paintor'

const profileTemplate = (name, age) => template(
  ($) => {
    $.div(
      { class: 'profileCard' },
      $.div($.label('Name: '), $.span(name)),
      $.div($.label('Age: '), $.span(age))
    )
  }
)

export const ProfileCard = (name, age) => component(
  profileTemplate(name, age)
)
