// our "a-grade" and "b-grade" browsers all support intersection observer
if (
  process.env.POLYFILL_ENV !== 'a-grade' &&
  process.env.POLYFILL_ENV !== 'b-grade'
) {
  require('intersection-observer')
}
