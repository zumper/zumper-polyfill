/**
 * @author       grady@zumper.com (Grady Kuhnline)
 * @copyright    Copyright (c) 2019, Zumper
 * @description  intersectionObserver.js
 */

// our "a-grade" and "b-grade" browsers all support intersection observer
if (
  process.env.POLYFILL_ENV !== 'a-grade' &&
  process.env.POLYFILL_ENV !== 'b-grade'
) {
  require('intersection-observer')
}
