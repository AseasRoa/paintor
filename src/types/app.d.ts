/**
 * A function that binds the property of
 * an HTML element with an element from a state
 */
type BindFunction = (element?: Node | undefined) => any

/**
 * Used in "if" statement for the condition parameter
 */
type StatementBindFunction = (element?: HTMLElement | undefined) => boolean

type ForLoopCallback<T> = (value?: T | undefined, key?: string | number | undefined) => boolean | undefined

type ForLoopIterableCallback = (index?: number | undefined) => boolean | undefined

type StatementRepaintFunction = (data: boolean | State) => void

/**
 * A single subscriptions record
 */
type Subscription = {
  element: Element | Comment;
  propertyName: string;
  subPropertyName: string;
  bindFunction: BindFunction;
  /**
   * Only used in the if() function
   */
  statementRepaintFunction: StatementRepaintFunction | null;
}