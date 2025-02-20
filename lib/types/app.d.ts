type TargetObject = import('../../types/types.d.ts').TargetObject
/**
 * Note: (keyof any) is the same as (string|number|symbol)
 */
type ObjectKey = (keyof any)

/**
 * A function that binds the property of
 * an HTML element with an element from a state
 */
type BindFn = (element?: Node | undefined) => any
type CallbackForFunction = (
  (
    values: any[],
    isInitialRun: boolean,
    commentBegin: Comment | null,
    commentEnd: Comment | null
  ) => void
)

/**
 * Used in "if" statement for the condition parameter
 */
type StatementBindFn = (element?: HTMLElement | undefined) => boolean

type Loopable = Array<any> | Record<keyof any, any> | Map<any, any> | Set<any>
type ForLoopCallback = (value: any, key: any) => boolean | void | Template
type ForLoopCallbackOnEmpty = () => undefined
type ForLoopIterableCallback = (index?: number | undefined) => boolean | undefined

type RepaintFnForFunction = (data: boolean | number | State) => void
type RepaintFnForState = (
  action: number,
  updatedObject: TargetObject,
  updatedState: State,
  prop: string | symbol,
  arrayFunctionArgs?: any[],
) => void
type RepaintFn = RepaintFnForFunction | RepaintFnForState

type StateProp = string | symbol
type Subscription = {
  element: HtmlElement,
  elementProp: string | symbol,
  elementInnerProp: string,
  repaintFn: null | RepaintFnForFunction | RepaintFnForState
}

type ObserverType = import('../../types/types.d.ts').ObserverType

type KeyToElements = Array<Set<Node>> | Record<ObjectKey, Set<Node>>

declare function CallbackForState(
  state: State,
  elementsCollector: import('../TemplateRenderer/ElementsCollector.js').ElementsCollector,
  keyToRender?: ObjectKey,
  isArrayState?: boolean
) : KeyToElements
