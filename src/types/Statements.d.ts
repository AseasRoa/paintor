/**
 * @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html
 */

type VariantKeysType<T> = T extends Map<infer K, any>
  ? K
  : T extends Set<any>
    ? number
    : T extends Array<any>
      ? number
      : T extends Record<infer K, any>
        ? K
        : T extends (...args: any[]) => infer F
          ? VariantKeysType<F>
          : never

type VariantValuesType<T> = T extends Map<any, infer V>
  ? V
  : T extends Set<infer V>
    ? V
    : T extends Array<infer V>
      ? V
      : T extends Record<any, infer V>
        ? V
        : T extends (...args: any[]) => infer F
          ? VariantValuesType<F>
          : never

export interface Statements {
  if (
    condition : boolean|{ (element?: HTMLElement):boolean },
    handler: { (): void },
    elseHandler?: { (): void }
  ) : HTMLElement[]

  // for(
  //   iterations : number,
  //   handler : (key:number) => boolean | any
  // ) : HTMLElement[] | Error

  forEach<
    Keys extends string | number,
    Values,
    Obj extends (Record<Keys, Values> | Map<Keys, Values>),
    Input extends Obj | (() => (Obj)),
  >(
    input : Input,
    handler : (value : VariantValuesType<Input>, key : VariantKeysType<Obj>) => boolean | any
  ) : HTMLElement[] | Error

  forEach<
    Obj extends (Array<any> | Set<any>),
    Input extends Obj | (() => (Obj)),
  >(
    array : Input,
    handler : (array : VariantValuesType<Input>, key : number) => boolean | any
  ) : HTMLElement[] | Error

  for(
    from : number,
    to : number,
    handler : (key:number) => boolean | any
  ) : HTMLElement[] | Error
}
