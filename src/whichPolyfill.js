// We need to know which is the best polyfill for the current browser based on feature detection.
// We have three polyfills: legacy, recent and current

// legacy is a super set of polyfills.
// recent and current are sub sets of legacy
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

// polyfills unique to legacy
const legacy = [
  notUndefined(array.find), // array.find
  notUndefined(array.findIndex), // array.find-index
  notUndefined(Array.from), // array.from
  notUndefined(array.includes), // array.includes
  // skipping array.iterator
  // skipping function.has-instance
  notUndefined(Function.prototype.name), // function.name
  notUndefined(Number.parseFloat), // number.parse-float
  notUndefined(Number.parseInt), // number.parse-int
  notUndefined(obj.assign), // object.assign
  notUndefined(obj.freeze), // object.freeze
  notUndefined(obj.getOwnPropertyDescriptor), // object.get-own-property-descriptor
  notUndefined(obj.getOwnPropertyNames), // object.get-own-property-names
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
    doesNotThrow(() => global.URL && new global.URL('http://a')), // web.url
]
// polyfills in legacy and recent (but not current)
const recent = [
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
// polyfills in legacy, recent and current
// NOTE: we don't need to test for current because that's the fallback polyfill
// const current = [
//   // skipping array.sort
//   global.Promise &&
//     global.Promise.prototype &&
//     notUndefined(global.Promise.prototype.finally), // promise.finally
//   notUndefined(global.Symbol), // symbol
//   // skipping symbol.async-iterator
//   // skipping web.timers
//   // skipping web.dom.iterable
// ]

const testFeature = (feature) => feature === false
module.exports = () => {
  try {
    if (legacy.some(testFeature)) {
      return 'legacy'
    } else if (recent.some(testFeature)) {
      return 'recent'
    }
    return 'current'
  } catch (error) {
    return 'legacy'
  }
}
