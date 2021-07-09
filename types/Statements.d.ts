export interface Statements {
  // "IF" with any input
  if (
    condition : boolean|{ (element?: HTMLElement):boolean },
    handler: { (): void }
  ) : void

  // "FOR" loop with Array input
  for<T>(
    array : Array<T>,
    handler: (key:number, value:T) => boolean | void
  ) : HTMLElement[] | Error;

  // "FOR" loop with Object input
  for<T>(
    object : Record<any, T>,
    handler: (key:number, value:T
    ) => boolean | void) : HTMLElement[] | Error;

  // "FOR" loop with iterations input
  for(
    iterations : number,
    handler: (key:number) => boolean | void
  ) : HTMLElement[] | Error;

  // "FOR" loop with from-to input
  for(
    from : number,
    to : number,
    handler: (key:number) => boolean | void
  ) : HTMLElement[] | Error;
}
