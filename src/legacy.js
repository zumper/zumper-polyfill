if (process.env.POLYFILL_ENV === 'legacy') {
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
