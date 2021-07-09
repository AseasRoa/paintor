import { Elements } from './Elements'
import { Statements } from './Statements'

type State = Record<any, any>
type States = Record<string, State>

export function paintor(
  target : string|HTMLElement,
  states: States,
  contents: { (arg: Elements|Statements): void }
): any

export function createState<T>(object: T) :T
