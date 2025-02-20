import { ClassComponent } from './ClassComponent/ClassComponent.js'
import { component, isComponent } from './export/component.js'
import { compose, Composition } from './export/compose.js'
import { fetchTranslations } from './export/fetchTranslations.js'
import { off, on } from './export/observe.js'
import { isState, setState, state } from './export/state.js'
import { style } from './export/style.js'
import { isTemplate, template } from './export/template.js'

const paintor = {
  ClassComponent,
  component,
  compose,
  Composition,
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
  ClassComponent,
  component,
  compose,
  Composition,
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
