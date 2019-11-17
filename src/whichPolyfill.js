// We need to know which is the best polyfill for the bGrade browser based on feature detection.
// We have four polyfills: dGrade, cGrade, bGrade and aGrade

const has = (thing, key) => notUndefined(thing) && notUndefined(thing[key])
const notUndefined = (thing) => typeof thing !== 'undefined'
const doesNotThrow = (func) => {
  try {
    func()
  } catch (e) {
    return false
  }
  return true
}
const obj = Object
// array/string instance to test against
const array = []
const string = ''
const symbol = global.Symbol

// dGrade is a super set of polyfills.
// cGrade and bGrade are sub sets of dGrade

// polyfills unique to dGrade
// NOTE: a "dGrade" browser would fail these tests
const dGrade = [
  notUndefined(array.fill), // array.fill
  notUndefined(array.find), // array.find
  notUndefined(array.findIndex), // array.find-index
  notUndefined(Array.from), // array.from
  notUndefined(array.includes), // array.includes
  // skipping array.iterator
  notUndefined(Function.prototype.name), // function.name
  notUndefined(Math.sign), // math.sign
  notUndefined(Number.isFinite), // number.is-finite
  notUndefined(Number.parseFloat), // number.parse-float
  notUndefined(Number.parseInt), // number.parse-int
  notUndefined(obj.assign), // object.assign
  notUndefined(obj.defineProperties), // object.define-properties
  notUndefined(obj.defineProperty), // object.define-property
  notUndefined(obj.freeze), // object.freeze
  notUndefined(obj.getOwnPropertyDescriptor), // object.get-own-property-descriptor
  notUndefined(obj.getOwnPropertyNames), // object.get-own-property-names
  notUndefined(obj.is), // object.is
  notUndefined(obj.isFrozen), // object.is-frozen
  notUndefined(obj.isSealed), // object.is-sealed
  notUndefined(obj.keys), // object.keys
  notUndefined(obj.seal), // object.seal
  notUndefined(global.Promise), // promise
  notUndefined(string.endsWith), // string.ends-with
  notUndefined(string.includes), // string.includes
  // skipping string.iterator
  notUndefined(string.repeat), // string.repeat
  notUndefined(string.startsWith), // string.starts-with
  notUndefined(symbol), // symbol
  has(symbol, 'iterator'), // symbol.iterator
  notUndefined(global.fetch), // whatwg-fetch
  notUndefined(global.requestAnimationFrame) &&
    notUndefined(global.cancelAnimationFrame), // raf/polyfill
  notUndefined(global.URL) &&
    doesNotThrow(() => global.URL && new global.URL('http://0')), // web.url
]
// polyfills in dGrade and cGrade (but not bGrade)
// NOTE: a "cGrade" browser would fail these tests
const cGrade = [
  notUndefined(global.Map), // map
  notUndefined(obj.entries), // object.entries
  notUndefined(obj.getOwnPropertyDescriptors), // object.get-own-property-descriptors
  notUndefined(obj.values), // object.values
  notUndefined(global.Set), // set
  has(symbol, 'hasInstance'), // symbol.has-instance
  has(symbol, 'isConcatSpreadable'), // symbol.is-concat-spreadable
  has(symbol, 'species'), // symbol.species
  has(symbol, 'toPrimitive'), // symbol.to-primitive
  has(symbol, 'unscopables'), // symbol.unscopables
  notUndefined(global.WeakMap), // weak-map
  notUndefined(global.WeakSet), // weak-set
  notUndefined(global.IntersectionObserver), // intersection-observer
  notUndefined(global.URLSearchParams), // web.url-search-params
  notUndefined(NodeList.prototype.forEach), // web.dom-collections.for-each
]
// polyfills in dGrade, cGrade and bGrade
// NOTE: a "bGrade" browser would fail these tests
const bGrade = [
  has(symbol && symbol(''), 'description'), // symbol.description
  has(symbol, 'asyncIterator'), // symbol.async-iterator
  has(symbol, 'match'), // es.symbol.match
  has(symbol, 'replace'), // es.symbol.replace
  has(symbol, 'search'), // es.symbol.search
  has(symbol, 'split'), // es.symbol.split
  has(array, symbol && symbol.iterator), // es.array.iterator
  notUndefined(string.trimEnd), // es.string.trim-end
  notUndefined(string.trimStart), // es.string.trim-start
]
// NOTE: we don't need to test for "aGrade" because that's the fallback polyfill

const testFeature = (feature) => feature === false
module.exports = () => {
  try {
    if (dGrade.some(testFeature)) {
      return 'd-grade'
    } else if (cGrade.some(testFeature)) {
      return 'c-grade'
    } else if (bGrade.some(testFeature)) {
      return 'b-grade'
    }
    return 'a-grade'
  } catch (error) {
    return 'd-grade'
  }
}
