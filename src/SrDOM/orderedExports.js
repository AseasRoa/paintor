/**
 * Order dependencies in a way to prevent
 * circular dependency problems
 *
 * @see https://stackoverflow.com/questions/60122727/referenceerror-cannot-access-player-before-initialization
 */

export { HTMLElement } from './HTMLElement.js'
export { Comment } from './Comment.js'
export { DocumentFragment } from './DocumentFragment.js'
export { Text } from './Text.js'
export { Node } from './Node.js'
export { Element } from './Element.js'
export { Document } from './Document.js'
