import { Elements } from './Elements'
import { Statements } from './Statements'

type State = Record<any, any>
type States = Record<string, State>

export type Paintor = Elements | Statements

export function paintor(
  target : string|HTMLElement,
  states: States,
  contents: { (paintor: Paintor, states?: States): void }
): any
