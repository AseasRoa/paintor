import { component, Component, isComponent } from './export/component.js'
import { compose } from './export/compose.js'
import { fetchTranslations } from './export/fetchTranslations.js'
import { off, on } from './export/observe.js'
import { isState, setState, state } from './export/state.js'
import { style } from './export/style.js'
import { isTemplate, template } from './export/template.js'

const paintor = {
  component,
  Component,
  compose,
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
}

export default paintor
export {
  component,
  Component,
  compose,
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
