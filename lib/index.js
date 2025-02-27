import { ClassComponent } from './ClassComponent/ClassComponent.js'
import { css, isTemplate, onMount, template } from './export/component.js'
import { compose, Composition } from './export/compose.js'
import { component, isComponent } from './export/deprecated.js'
import { fetchTranslations } from './export/fetchTranslations.js'
import { off, on } from './export/observe.js'
import { isState, setState, state } from './export/state.js'
import { style } from './export/style.js'

const paintor = {
  ClassComponent,
  component,
  compose,
  Composition,
  css,
  fetchTranslations,
  isComponent,
  isState,
  isTemplate,
  on,
  onMount,
  off,
  setState,
  state,
  style,
  template
}

export default paintor
export {
  ClassComponent,
  component,
  compose,
  Composition,
  css,
  fetchTranslations,
  isComponent,
  isState,
  isTemplate,
  off,
  on,
  onMount,
  paintor,
  setState,
  state,
  style,
  template
}
