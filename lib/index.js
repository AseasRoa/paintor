import { component, Component, isComponent } from './export/component.js'
import { fetchTranslations } from './export/fetchTranslations.js'
import { off, on } from './export/observe.js'
import { isState, setState, state } from './export/state.js'
import { style } from './export/style.js'
import { isTemplate, template } from './export/template.js'

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
  style,
  template,
  Component
}

export default paintor
export {
  component,
  Component,
  fetchTranslations,
  isComponent,
  isState,
  isTemplate,
  off,
  on,
  paintor,
  setState,
  state,
  style,
  template
}
