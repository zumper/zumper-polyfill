// Check for scroll behavior (safari), and scroll methods (ie11 and others)
const smoothScroll = require('smoothscroll-polyfill')
const w = window
const d = document
const E = w.HTMLElement || w.Element
if (
  !('scrollBehavior' in d.documentElement.style) ||
  (!w.scroll || !w.scrollTo || !w.scrollBy) ||
  !E.prototype.scrollIntoView
) {
  smoothScroll.polyfill()
}
