/**
 * @author       grady@zumper.com (Grady Kuhnline)
 * @copyright    Copyright (c) 2019, Zumper
 * @description  babel.config.js
 */

const { POLYFILL_ENV } = process.env
const loose = true

let targets
switch (POLYFILL_ENV) {
  case 'a-grade':
    targets = [
      'last 2 chrome versions',
      'last 2 firefox versions',
      'last 1 safari version',
      'last 1 ios version',
    ]
    break
  case 'b-grade':
    // first browsers with "full" es6 support
    // https://caniuse.com/#feat=intersectionobserver
    // https://caniuse.com/#feat=es6-module
    // https://caniuse.com/#feat=async-functions
    // https://caniuse.com/#search=urlsearchparams
    targets = {
      chrome: '61',
      firefox: '60',
      ios: '12.2',
      safari: '12.1',
      edge: '17', // <-- not considered b-grade for bundles
    }
    break
  case 'c-grade':
    // first browsers with `class`, promise and support for fetch
    // https://caniuse.com/#feat=es6-class
    // https://caniuse.com/#feat=fetch
    targets = {
      chrome: '49',
      firefox: '46',
      ios: '10.3',
      safari: '10.1',
      edge: '14',
    }
    break
  case 'd-grade':
    targets = ['chrome 38', 'ie 11', '>0.2%', 'not dead', 'not op_mini all']
    break
}

const useAGrade = POLYFILL_ENV === 'a-grade'
const useBGrade = POLYFILL_ENV === 'b-grade'
const useCGrade = POLYFILL_ENV === 'c-grade'
const useDGrade = POLYFILL_ENV === 'd-grade'

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets,
        loose,
        corejs: 3,
        modules: false,
        bugfixes: true,
        exclude: [
          'es.*.to-string-tag',
          'es.array.concat',
          'es.array.copy-within',
          'es.array.every',
          'es.array.filter',
          !useDGrade && 'es.array.find',
          !useDGrade && 'es.array.find-index',
          !useDGrade && 'es.array.from',
          'es.array.for-each',
          'es.array.index-of',
          !useDGrade && 'es.array.includes',
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
          'es.array.splice',
          'es.array-buffer.constructor',
          'es.array-buffer.is-view',
          'es.array-buffer.slice',
          'es.data-view',
          'es.date.*',
          'es.function.has-instance',
          'es.math.acosh',
          'es.math.asinh',
          'es.math.atanh',
          'es.math.cbrt',
          'es.math.clz32',
          'es.math.cosh',
          'es.math.expm1',
          'es.math.fround',
          'es.math.hypot',
          'es.math.imul',
          'es.math.log10',
          'es.math.log1p',
          'es.math.sinh',
          'es.math.tanh',
          'es.math.trunc',
          'es.number.constructor',
          'es.number.epsilon',
          'es.number.is-integer',
          'es.number.is-nan',
          'es.number.is-safe-integer',
          'es.number.max-safe-integer',
          'es.number.min-safe-integer',
          !useDGrade && 'es.number.parse-float',
          'es.number.to-fixed',
          'es.number.to-precision',
          !useDGrade && 'es.object.assign',
          'es.object.define-getter',
          'es.object.define-properties',
          'es.object.define-property',
          'es.object.define-setter',
          'es.object.get-prototype-of',
          'es.object.is-extensible',
          'es.object.lookup-getter',
          'es.object.lookup-setter',
          'es.object.prevent-extensions',
          'es.object.set-prototype-of',
          !useDGrade && 'es.promise',
          'es.promise.finally',
          'es.reflect.*',
          'es.regexp.*',
          'es.string.anchor',
          'es.string.big',
          'es.string.blink',
          'es.string.bold',
          'es.string.code-point-at',
          !useDGrade && 'es.string.ends-with',
          'es.string.fixed',
          'es.string.from-code-point',
          'es.string.fontcolor',
          'es.string.fontsize',
          !useDGrade && 'es.string.includes',
          'es.string.italics',
          'es.string.link',
          'es.string.match',
          'es.string.pad-end',
          'es.string.pad-start',
          'es.string.raw',
          !useDGrade && 'es.string.replace',
          'es.string.search',
          'es.string.small',
          'es.string.split',
          'es.string.strike',
          !useDGrade && 'es.string.starts-with',
          'es.string.sub',
          'es.string.sup',
          'es.string.trim',
          'es.typed.*',
          'transform-regenerator',
          useAGrade && 'web.dom-collections.iterator',
          'web.immediate',
          'web.queue-microtask',
          !useDGrade && 'web.url',
          !useDGrade && 'web.url.to-json',
          (useBGrade || useAGrade) && 'web.url-search-params',
        ].filter(Boolean),
        useBuiltIns: 'entry',
      },
    ],
  ],
}
