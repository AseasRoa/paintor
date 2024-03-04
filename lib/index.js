import { Component } from './Component.js'
import { component, isComponent } from './functions/component.js'
import { fetchTranslations } from './functions/fetchTranslations.js'
import { off, on } from './functions/observe.js'
import { isTemplate, template } from './functions/template.js'
import { isState, setState, state } from './state/state.js'

const paintor = {
  component,
  fetchTranslations,
  isComponent,
  isState,
  isTemplate,
  on,
  off,
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
  on,
  off,
  setState,
  state,
  template,
  Component
}
