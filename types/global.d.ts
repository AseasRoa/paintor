/**
 * This file makes some of the types global (ambient),
 * so they can be used in the current module.
 *
 * @see https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules
 */

type Composable = import('./types.d.ts').Composable
type Composition = import('./types.d.ts').Composition
type State = import('./types.d.ts').State
type States = import('./types.d.ts').States
type Template = import('./types.d.ts').Template
type TemplateTree = import('./types.d.ts').TemplateTree
type Translation = import('./types.d.ts').Translation
type ObserverListener = import('./types.d.ts').ObserverListener
