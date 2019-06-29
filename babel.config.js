const { NODE_ENV, POLYFILL_ENV } = process.env
const loose = true

let targets
switch (POLYFILL_ENV) {
  case 'current':
    // first browsers with "full" es6 support
    targets = {
      chrome: '58',
      firefox: '55',
      ios: '12.2',
      safari: '12.1',
      edge: '17',
    }
    break
  case 'recent':
    // first browsers with `class`, promise and support for fetch
    targets = {
      chrome: '49',
      firefox: '45',
      ios: '10.3',
      safari: '10.1',
      edge: '14',
    }
    break
  case 'legacy':
    targets = ['>0.2%', 'not dead', 'ie 11', 'chrome 41']
    break
}

const useCurrent = POLYFILL_ENV === 'current'
const useRecent = POLYFILL_ENV === 'recent'
const useLegacy = POLYFILL_ENV === 'legacy'

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets,
        loose,
        corejs: 3,
        modules: false,
        exclude: [
          // 'es.*.species',
          'es.*.to-string-tag',
          // 'es.*.unscopables',
          'es.array.concat',
          'es.array.copy-within',
          'es.array.every',
          'es.array.filter',
          !useLegacy && 'es.array.find',
          !useLegacy && 'es.array.find-index',
          'es.array.flat',
          'es.array.flat-map',
          !useLegacy && 'es.array.from',
          'es.array.for-each',
          'es.array.index-of',
          !useLegacy && 'es.array.includes',
          // 'es.array.iterator',
          'es.array.join',
          'es.array.last-index-of',
          'es.array.map',
          'es.array.of',
          'es.array.reduce',
          'es.array.reduce-right',
          'es.array.reverse',
          'es.array.slice',
          'es.array.some',
          'es.array.sort',
          // 'es.array.species',
          'es.array.splice',
          'es.array.unscopables.flat',
          'es.array.unscopables.flat-map',
          'es.array-buffer.constructor',
          'es.array-buffer.is-view',
          'es.array-buffer.slice',
          'es.data-view',
          'es.date.*',
          'es.function.has-instance',
          'es.math.*',
          'es.number.constructor',
          'es.number.epsilon',
          'es.number.is-finite',
          'es.number.is-integer',
          'es.number.is-nan',
          'es.number.is-safe-integer',
          'es.number.max-safe-integer',
          'es.number.min-safe-integer',
          !useLegacy && 'es.number.parse-float',
          'es.number.to-fixed',
          'es.number.to-precision',
          'es.object.define-getter',
          'es.object.define-setter',
          'es.object.get-prototype-of',
          'es.object.from-entries',
          'es.object.is-extensible',
          'es.object.lookup-getter',
          'es.object.lookup-setter',
          'es.object.prevent-extensions',
          'es.object.set-prototype-of',
          !useLegacy && 'es.promise',
          'es.promise.finally',
          'es.reflect.*',
          'es.regexp.*',
          'es.string.anchor',
          'es.string.big',
          'es.string.blink',
          'es.string.bold',
          'es.string.code-point-at',
          !useLegacy && 'es.string.ends-with',
          'es.string.fixed',
          'es.string.from-code-point',
          'es.string.fontcolor',
          'es.string.fontsize',
          !useLegacy && 'es.string.includes',
          'es.string.italics',
          'es.string.link',
          'es.string.match',
          'es.string.pad-end',
          'es.string.pad-start',
          'es.string.raw',
          'es.string.replace',
          'es.string.search',
          'es.string.small',
          'es.string.split',
          'es.string.strike',
          !useLegacy && 'es.string.starts-with',
          'es.string.sub',
          'es.string.sup',
          'es.string.trim',
          'es.typed.*',
          'transform-regenerator',
          // 'web.dom-collections.iterator',
          'web.immediate',
          'web.queue-microtask',
          !useLegacy && 'web.url',
          !useLegacy && 'web.url.to-json',
          useCurrent && 'web.url-search-params',
        ].filter(Boolean),
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread', { loose }],
    '@babel/transform-react-jsx',
  ].filter(Boolean),
}
