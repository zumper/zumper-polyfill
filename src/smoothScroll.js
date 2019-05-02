// Check for scroll behavior (safari), and scroll methods (ie11 and others)
const smoothScroll = require('smoothscroll-polyfill')
if (
  !('scrollBehavior' in document.documentElement.style) ||
  (!global.scroll || !global.scrollTo || !global.scrollBy) ||
  !(global.HTMLElement || global.Element).prototype.scrollIntoView
) {
  smoothScroll.polyfill()
}
