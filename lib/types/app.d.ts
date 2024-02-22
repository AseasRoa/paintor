type ObjectKey = string | number | symbol
type TargetObject = Object<any, any> | Array<any>

/**
 * A function that binds the property of
 * an HTML element with an element from a state
 */
type BindFunction = (element?: Node | undefined) => any
type CallbackForFunction = (
  (
    values: any[],
    isInitialRun: boolean,
    commentElementBegin: Comment | null,
    commentElementEnd: Comment | null
  ) => void
)

/**
 * Used in "if" statement for the condition parameter
 */
type StatementBindFunction = (element?: HTMLElement | undefined) => boolean

type ForLoopCallback<T> = (value?: T | undefined, key?: string | number | undefined) => boolean | undefined | Template | Component
type ForLoopCallbackOnEmpty = () => undefined
type ForLoopIterableCallback = (index?: number | undefined) => boolean | undefined

type RepaintFunctionForFunction = (data: boolean | number | State) => void
type RepaintFunctionForState = (
  action: number,
  updatedObject: TargetObject,
  updatedState: State,
  prop: string | symbol,
  arrayFunctionArgs?: any[],
) => void
type RepaintFunction = RepaintFunctionForFunction | RepaintFunctionForState

/**
 * A single subscriptions record
 */
type Subscription = {
  propertyName: string | symbol,
  subPropertyName: string,
  bindFunction: BindFunction,
  /**
   * Only used in the if() function
   */
  repaintFunction: null | RepaintFunctionForFunction | RepaintFunctionForState,
  /**
   * Used for cleaning up subscriptions from the DOM element itself,
   * when the element is being removed
   */
  subscriptionsInstance: import('../state/Subscriptions').Subscriptions,
  state: State
}
