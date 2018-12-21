// We need to know which is the best polyfill for the current browser based on feature detection.
// We have three polyfills: legacy, recent and current

// legacy is a super set of polyfills.
// recent and current are sub sets of legacy
const notUndefined = (thing) => typeof thing !== 'undefined'
const obj = Object
const self = window
// array/string instance to test against
const array = []
const string = ''

// polyfills unique to legacy
const legacy = [
  notUndefined(array.find), // array.find
  notUndefined(array.findIndex), // array.find-index
  notUndefined(array.includes), // array.includes
  // skipping array.iterator
  // skipping function.has-instance
  notUndefined(Function.prototype.name), // function.name
  notUndefined(obj.assign), // object.assign
  notUndefined(obj.freeze), // object.freeze
  notUndefined(obj.getOwnPropertyDescriptor), // object.get-own-property-descriptor
  notUndefined(obj.getOwnPropertyNames), // object.get-own-property-names
  notUndefined(obj.isFrozen), // object.is-frozen
  notUndefined(obj.isSealed), // object.is-sealed
  notUndefined(obj.keys), // object.keys
  notUndefined(obj.seal), // object.seal
  notUndefined(string.endsWith), // string.ends-with
  notUndefined(string.includes), // string.includes
  // skipping string.iterator
  notUndefined(string.repeat), // string.repeat
  notUndefined(string.startsWith), // string.starts-with
  notUndefined(self.fetch), // whatwg-fetch
  notUndefined(self.requestAnimationFrame) &&
    notUndefined(self.cancelAnimationFrame), // raf/polyfill
]
// polyfills in legacy and recent (but not current)
const recent = [
  notUndefined(Array.from), // array.from
  notUndefined(self.Map), // map
  notUndefined(obj.entries), // object.entries
  notUndefined(obj.getOwnPropertyDescriptors), // object.get-own-property-descriptors
  notUndefined(obj.values), // object.values
  notUndefined(self.Promise), // promise
  notUndefined(self.Set), // set
  notUndefined(self.WeakMap), // weak-map
  notUndefined(self.WeakSet), // weak-set
  notUndefined(self.IntersectionObserver), // intersection-observer
]
// polyfills in legacy, recent and current
// NOTE: we don't need to test for current because that's the fallback polyfill
// const current = [
//   // skipping array.sort
//   self.Promise &&
//     self.Promise.prototype &&
//     notUndefined(self.Promise.prototype.finally), // promise.finally
//   notUndefined(self.Symbol), // symbol
//   // skipping symbol.async-iterator
//   // skipping web.timers
//   // skipping web.dom.iterable
// ]

const testFeature = (feature) => feature === false
self.whichPolyfill = () => {
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
