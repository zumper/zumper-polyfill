// our "current" browsers all support intersection observer
if (process.env.POLYFILL_ENV !== 'current') {
  require('intersection-observer')
}
