import { Component } from './Component.js'
import { createState } from './State.js'
import { fetchTranslations } from './Translation.js'

/**
 * @param {(Template | Component)[]} templates
 * @returns {Component}
 */
function compose(...templates) {
  return new Component().useTemplates(...templates)
}

/**
 * @param {Template} template
 * @returns {Template}
 */
function createTemplate(template) {
  return template
}

const paintor = { compose, createState, createTemplate, fetchTranslations, Component }

export default paintor
export { paintor, compose, createState, createTemplate, fetchTranslations, Component }
