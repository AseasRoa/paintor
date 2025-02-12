import { CSSPropertiesJsStyle } from './WebApi/CSSProperties'
import { Elements } from './WebApi/Elements'
import { Statements } from './Statements'

export interface StyleRules extends CSSPropertiesJsStyle {}
export interface TemplateTree extends Elements, Statements {}
export type Template = (tree : TemplateTree) => (
  void
  | string
  | HTMLElement | HTMLElement[]
  | Component | Component[]
  | Template | Template[]
)

export type Translation = Record<string, any>

export type TargetObject = (Array<any> | Record<keyof any, any>)
export type State = (Array<any> | Record<keyof any, any>)
export type States = Record<string, State>

export interface Component {
  clear: () => void,
  html: (options?: { indent?: string }) => string,
  paint: (container: string | HTMLElement | HTMLElement[] | HTMLCollection) => void,
  static: (on?: boolean) => Component,
  staticHtml: (options?: { indent?: string }) => string,
  useTranslations : (...translations: Translation[]) => Component,
  state?: State,
  template?: Template,
}

export type ObserverType = ('create'|'change'|'delete'|'set')
export type ObserverListener = (
  event: {
    key: keyof any,
    value: any,
    oldValue: any,
    target: TargetObject,
    state: State,
  }
) => void
