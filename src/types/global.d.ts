type Elements = import('./WebApi/Elements').Elements
type Statements = import('./Statements').Statements

type State = Record<any, any> | Array<any> | Set<any> | Map<any, any>
type States = Record<string, State>
type Tree = Elements & Statements
type Model = (tree : Tree) => HTMLElement | HTMLElement[] | string | Paintor | Paintor[] | Model | void
type Translation = Record<string, any>

type PaintorTree = Tree
type PaintorModel = Model

interface Paintor {
  (container: string | HTMLElement): void | string,
  createModel: PaintorModel,
  useTranslations : (...translations: Translation[]) => Paintor,
  compose: (...models: Model[]) => Paintor,
  static: (on?: boolean) => Paintor,
  paint: (container: string | HTMLElement) => void,
  appendTo: (container: string | HTMLElement) => void,
  getHtml: (options?: { indent?:string }) => string,
  getStaticHtml: (options?: { indent?:string }) => string
}

declare module 'paintor' {
  function createModel(model: Model) : Model

  /**
   * @template T
   * @param {T} object Your input object or array
   * @returns {T} A proxy object/array that looks the same as the input object/array
   */
  function createState<T>(object : T) : T

  /**
   * @template T
   * @param {T} defaultPaths
   * One or more paths to files, exporting an object as default.
   * The file name of each path will be replaced with the user's locale, so the actual file from
   * which the translation is read could be different. But if a file for the user's locale doesn't
   * exist, the provided file name will be used.
   * @returns {Promise<Translation>}
   */
  function createTranslation(...defaultPaths: string[]) : Promise<Translation>

  /**
   * @param {Model} models
   * @returns {Paintor}
   */
  function compose(...models: Model[]): Paintor

  //const compose: (...models: Model[]) => Paintor
  const paintor: Paintor // & ((container: string | HTMLElement) => PaintorInterface)
}
