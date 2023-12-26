import { isBrowserEnvironment } from './functions.js'

/**
 * TODO make it work for server environment
 *
 * @returns {string}
 */
const getLocale = function() {
  let locale = 'en'

  if (isBrowserEnvironment()) {
    const html = document.getElementById('html')

    locale = html?.getAttribute('lang') ?? locale
  }

  return locale
}

/**
 * @param {string} defaultPath
 * @param {string} locale
 * @returns {Promise<Translation>}
 * @throws
 */
const createSingleTranslation = async function(defaultPath, locale) {
  if (typeof defaultPath !== 'string') {
    throw new Error('Translation path must be a string')
  }

  let translation = null

  /**
   * Matches on /path/to/filename.ext
   * [1] /path/to/
   * [2] filename
   * [3] .ext
   *
   * @type {RegExpMatchArray | null}
   */
  const match = defaultPath.match(/^(.*?)([^.\/\\]+)(.\w+)$/um)

  if (match === null) {
    throw new TypeError(`Incorrect path: ${defaultPath}`)
  }

  const filePath = match[1] + locale + match[3]

  try {
    translation = (await import(filePath)).default
  }
  catch (e) {
    if (filePath !== defaultPath) {
      translation = (await import(defaultPath)).default
    }
  }

  if (!(translation instanceof Object)) {
    throw new TypeError(`Translation at ${filePath} must export an object`)
  }

  return translation
}

/**
 * @param {...string} defaultPaths
 * @returns {Promise<Translation[]>}
 * @throws
 */
// eslint-disable-next-line require-await
const fetchTranslations = async function(...defaultPaths) {
  const locale = getLocale()

  const promises = []

  for (const path of defaultPaths) {
    promises.push(createSingleTranslation(path, locale))
  }

  return Promise.all(promises)
}

export { fetchTranslations }
