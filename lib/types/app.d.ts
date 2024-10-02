type ObjectKey = string | number | symbol
type TargetObject = import('../../types/types.d.ts').TargetObject

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

type ForLoopCallback<T> = (value?: T | undefined, key?: string | number | undefined) => boolean | undefined | Template | Component
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

enum EnumObserverType {
  CREATE = 0,
  CHANGE = 1,
  DELETE = 2,
  SET = 3
}
type ObserverType = import('../../types/types.d.ts').ObserverType
type ObserverListener = import('../../types/types.d.ts').ObserverListener

type KeyToElements = Record<ObjectKey, Node[]> | Array<number, Node[]>

function CallbackForState(
  state: State,
  elementsCollector: import('../ElementsCollector.js').ElementsCollector,
  keyToRender?: ObjectKey,
  isArrayState?: boolean
) : KeyToElements
