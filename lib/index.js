import { Component } from './Component/Component.js'
import { css, isTemplate, onMount, template } from './export/component.js'
import { compose, Composition, isComposition } from './export/compose.js'
import { fetchTranslations } from './export/fetchTranslations.js'
import { off, on } from './export/observe.js'
import { isState, setState, state } from './export/state.js'
import { style } from './export/style.js'

const paintor = {
  Component,
  compose,
  Composition,
  css,
  fetchTranslations,
  isComposition,
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
  Component,
  compose,
  Composition,
  css,
  fetchTranslations,
  isComposition,
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
