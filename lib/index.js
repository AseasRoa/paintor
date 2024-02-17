import { Component } from './Component.js'
import { component, isComponent } from './functions/component.js'
import { fetchTranslations } from './functions/fetchTranslations.js'
import { isTemplate, template } from './functions/template.js'
import { isState, setState, state } from './state/state.js'

const paintor = {
  component,
  fetchTranslations,
  isComponent,
  isState,
  isTemplate,
  setState,
  state,
  template,
  Component
}

export default paintor
export {
  paintor,
  component,
  fetchTranslations,
  isComponent,
  isState,
  isTemplate,
  setState,
  state,
  template,
  Component
}
