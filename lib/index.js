import { Component } from './Component.js'
import { component, isComponent } from './functions/component.js'
import { fetchTranslations } from './functions/fetchTranslations.js'
import { off, on } from './functions/observe.js'
import { style } from './functions/style.js'
import { isTemplate, template } from './functions/template.js'
import { state } from './state/state.js'
import { isState, setState } from './state/stateProps.js'

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
