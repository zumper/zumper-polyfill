const gradedTargets = new Map()

gradedTargets.set('a-grade', [
  'last 2 chrome versions',
  'last 2 firefox versions',
  'last 1 safari version',
  'last 1 ios version',
])

// first browsers with "full" es6 support
// https://caniuse.com/#feat=intersectionobserver
// https://caniuse.com/#feat=es6-module
// https://caniuse.com/#feat=async-functions
// https://caniuse.com/#search=urlsearchparams
gradedTargets.set('b-grade', {
  chrome: '61',
  firefox: '60',
  ios: '12.2',
  safari: '12.1',
  edge: '17', // <-- not b-grade for whichBundle
})

// first browsers with `class`, promise and support for fetch
// https://caniuse.com/#feat=es6-class
// https://caniuse.com/#feat=fetch
gradedTargets.set('c-grade', {
  chrome: '49',
  firefox: '46',
  ios: '10.3',
  safari: '10.1',
  edge: '14',
})

// ancient browsers
gradedTargets.set('d-grade', [
  'chrome 38',
  'ie 11',
  '>0.2%',
  'not dead',
  'not op_mini all',
])

module.exports = { gradedTargets }
