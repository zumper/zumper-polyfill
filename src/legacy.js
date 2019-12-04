/**
 * @author       grady@zumper.com (Grady Kuhnline)
 * @copyright    Copyright (c) 2019, Zumper
 * @description  Polyfills that only apply to d-grade browsers
 */

if (process.env.POLYFILL_ENV === 'd-grade') {
  require('whatwg-fetch')
  require('raf/polyfill')
  // https://github.com/Pomax/react-onclickoutside/blob/master/README.md#ie-does-not-support-classlist-for-svg-elements
  if (!('classList' in SVGElement.prototype)) {
    Object.defineProperty(SVGElement.prototype, 'classList', {
      get() {
        return {
          contains: (className) => {
            return this.className.baseVal.split(' ').indexOf(className) !== -1
          },
        }
      },
    })
  }
}
