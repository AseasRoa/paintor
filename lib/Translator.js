import { format, getGlobalObject } from './functions/misc.js'

class Translator {
  /** @type {Translation[]} */
  #translations = []

  /**
   * @returns {Translation[]}
   */
  get translations() {
    return this.#translations
  }

  /**
   * @param {any} input
   * @returns {string}
   */
  translate(input) {
    if (typeof input === 'string') {
      const translated = this.#translateString(input, this.#translations)

      if (typeof translated === 'string') {
        return translated
      }

      // Use the global translation
      const globalObject = getGlobalObject()

      const globallyTranslated = this.#translateString(
        input,
        // @ts-ignore
        globalObject.paintorTranslations,
      )

      if (typeof globallyTranslated === 'string') {
        return globallyTranslated
      }
    }

    return input
  }

  /**
   * This function first translates each part of the input array,
   * then formats it, then translates the result.
   *
   * @template T
   * @param {T[]} array
   * The input array is supposed to be what would format() arguments be
   * (format string plus multiple arguments), but as an array.
   * @returns {string}
   */
  translateArray(array) {
    return this.translate(
      format.apply(
        null,
        // @ts-ignore
        this.#translateArray(array),
      ),
    )
  }

  /**
   * @param {...Translation} translations
   * @returns {void}
   */
  useTranslations(...translations) {
    /*
     * Reset translations here, because the whole api chain (containing
     * this  function) can be executed multiple times, but with different
     * translations every time.
     * EDIT: Commented out, so that translations can be used in Components
     * this.#translations = []
     */

    for (const item of translations) {
      if (item instanceof Array) {
        for (const subItem of item) {
          if (!this.#translations.includes(subItem)) {
            this.#translations = [...this.#translations, subItem]
          }
        }
      }
      else if (typeof item === 'object') {
        if (!this.#translations.includes(item)) {
          this.#translations = [...this.#translations, item]
        }
      }
    }
  }

  /**
   * @template T
   * @param {T[]} array
   * @returns {(string | T)[]}
   */
  #translateArray(array) {
    if (this.#translations.length === 0) {
      return array
    }

    const translatedArray = new Array(array.length)

    for (let i = 0; i < array.length; i++) {
      translatedArray[i] = this.translate(array[i])
    }

    return translatedArray
  }

  /**
   * @param {string} str
   * @param {Translation[]} [translations]
   * @returns {string | boolean}
   */
  #translateString(str, translations) {
    if (translations) {
      for (const translateObject of translations) {
        if (str in translateObject) {
          return translateObject[str]
        }
      }
    }

    return false
  }
}

export { Translator }
