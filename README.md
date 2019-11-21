# Zumper polyfill

Package containing prebuilt polyfills for use in Zumper's React applications. The polyfill is broken into three versions to ensure that we deliver a more appropriate pollyfill based on the user's browser.

This polyfill is designed to work differently than [`@babel/polyfill`](https://babeljs.io/docs/en/babel-polyfill) and [`react-app-polyfill`](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill). Instead of including `@zumper/polyfill` at the top of your entrypoint, you need to run code on the client to figure out which polyfill should load before initializing your app.

Instead of having just one polyfill, we decided to build four polyfills so that browsers with more capabilities will get a smaller file. This is similar in concept to what [polyfill.io](https://polyfill.io/v2/docs/) offers. However, instead of supporting an infinite number of polyfill combinations, we chose the groupings that seemed to balance file size well enough to suit our needs.

- **A Grade:** 1.5 kB gzipped, latest Chrome, Firefox and Safari
- **B Grade:** 6.1 kB gzipped, the latest features; requires very few polyfills.
- **C Grade:** 14.4 kB gzipped, fairly new; needs more polyfills.
- **D Grade:** 27.4 kB gzipped, needs the most polyfills.

## Install

```bash
yarn add @zumper/polyfill
```

## API

### `whichPolyfill`

We include a convenience function that will perform feature tests in the browser and report which polyfill is best suited for that browser. This ensure that you don't ship unnecessary polyfills to browsers that don't need them.

```html
<!-- don't do it this way in your app -->
<script src="https://unpkg.com/@zumper/polyfill/dist/whichPolyfill.min.js"></script>
<script>
  var grade = whichPolyfill()

  // choose the right polyfill for this browser
  var polyfill = document.createElement('script')
  polyfill.src =
    'https://unpkg.com/@zumper/polyfill/dist/polyfill.' + grade + '.js'
  document.body.appendChild(polyfill)
</script>
```

**NOTE:** Do not include the scripts directly from unpkg.com. It won't be very fast. See below for recommendations on how to integrate `whichPolyfill` in production.

### `whichBundle`

We also include a convenience function that will perform feature tests in the browser and report which _bundle_ is best suited for that browser.

This is useful for serving different app bundles for modern and legacy browsers. It is independent of `whichPolyfill` because it detects support for _syntax_, which cannot be polyfilled.

An a-grade browser can support things like `async` functions natively where-as a d-grade browser would throw syntax errors. Using `whichBundle` allows you to serve a different build of your app to different browsers.

```html
<!-- don't do it this way in your app -->
<script src="https://unpkg.com/@zumper/polyfill/dist/whichBundle.min.js"></script>
<script>
  var grade = whichBundle()

  // choose the right bundle for this browser
  var bundle = document.createElement('script')
  bundle.src = 'https://example.com/js/bundle.' + grade + '.js'
  document.body.appendChild(bundle)
</script>
```

**NOTE:** Do not include the scripts directly from unpkg.com. It won't be very fast. See below for recommendations on how to integrate `whichBundle` in production.

## Usage

Unlike other polyfills, `@zumper/polyfill` takes some additional setup. It is designed to work with Zumper's code building strategy and may not suit all use cases. If you are looking for a simple polyfill solution, try [`@babel/polyfill`](https://babeljs.io/docs/en/babel-polyfill).

### Including the polyfills in your build

We ship prebuilt polyfills in the `dist` folder. Rather than specifying the polyfills as endpoints in your webpack config, it is recommended to use [`copy-webpack-plugin`](https://github.com/webpack-contrib/copy-webpack-plugin) to copy the prebuilt versions to your output.

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './node_modules/@zumper/polyfill/dist/polyfill.*.min.js',
        to: './build/js/',
        transformPath: (targetPath) =>
          targetPath.replace(
            /(.*)node_modules[/]@zumper[/]polyfill[/]dist[/](.*[.]min[.]js)$/,
            '$1$2'
          ),
      },
    ]),
  ],
}
```

### Embedding the `whichPolyfill` function in your HTML

We also ship a `whichPolyfill` function in the `dist` folder. This function will identify the right polyfill for the current browser using feature detection.

It is possible to read the minified polyfill directly from the `node_modules` folder.

Our recommendation is to embed the script directly into your rendered HTML to ensure the fastest performance.

**NOTE:** a similar approach should be used to embed `whichBundle` in your page.

```js
const readWhichPolyfill = () => {
  // locate the minified file
  const whichPolyfillPath = path.join(
    path.dirname(require.resolve('@zumper/polyfill')),
    '..',
    'dist',
    'whichPolyfill.min.js'
  )
  return fs.readFileSync(whichPolyfillPath)
}

// read the minified script to a string
let whichPolyfill
try {
  whichPolyfill = readWhichPolyfill()
} catch (error) {
  Log.debug(error)
  whichPolyfill = "window.whichPolyfill = function() { return 'd-grade' };"
}

// presumably you'd add this to your node server response somewhere
export default `<script>${whichPolyfill}</script>`
```

### Loading your bundles after loading the right polyfill

At Zumper, we use [`@loadable/component`](https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/) to know which bundles to load. We generate our final HTML on the server and add those bundles to the output.

Below is an example of the bottom of a typical document.

1. Use `<link rel="preload" />` to get the bundles downloading ASAP
2. Delay loading the polyfill until the HTML has finished loading
3. Choose the right polyfill to load
4. Delay loading the bundles until the polyfill has loaded

```html
<!-- 1. use preload for all of the bundles -->
<link
  rel="preload"
  href="https://cdn.example.com/js/runtime-main.js"
  as="script"
/>
<link rel="preload" href="https://cdn.example.com/js/main.js" as="script" />
<link rel="preload" href="https://cdn.example.com/js/homepage.js" as="script" />
<link rel="preload" href="https://cdn.example.com/css/main.css" as="style" />
<link
  rel="preload"
  href="https://cdn.example.com/css/homepage.css"
  as="style"
/>
<script>
  // ... embedded whichPolyfill.js (see above)
</script>
<script>
  'use strict'
  !(function() {
    var bundles = [
      'https://cdn.example.com/js/runtime-main.js',
      'https://cdn.example.com/js/main.js',
      'https://cdn.example.com/js/homepage.js',
    ]
    var loadBundles = function() {
      bundles.forEach(function(src) {
        var bundle = document.createElement('script')
        bundle.src = src
        bundle.async = false
        bundle.crossOrigin = 'anonymous'
        document.body.appendChild(bundle)
      })
    }
    var loadPolyfill = function() {
      var polyfill = document.createElement('script')
      var timeout = setTimeout(function() {
        console.warn('Polyfill timed out!')
      }, 1000)
      // 3. Choose the right polyfill to load
      polyfill.src =
        'https://cdn.example.com/js/polyfill.' + whichPolyfill() + '.min.js'
      polyfill.async = false
      polyfill.crossOrigin = 'anonymous'

      // 4. Delay loading the bundles until the polyfill has loaded
      polyfill.onload = function() {
        clearTimeout(timeout)
        loadBundles()
      }
      polyfill.onerror = function(error) {
        console.error('Polyfill load error!', error)
      }
      document.body.appendChild(polyfill)
    }

    // 2. Delay loading the polyfill until the HTML has finished loading
    document.addEventListener('DOMContentLoaded', function() {
      var raf =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.setTimeout
      raf(loadPolyfill)
    })
  })()
</script>
```

## Alternate import usage

We also publish cjs and es builds in the `lib` and `es` folders respectively. Feel free to let us know if those are useful to you!

```js
// es version
import aGradePolyfill from '@zumper/polyfill/es/polyfill.a-grade'
import bGradePolyfill from '@zumper/polyfill/es/polyfill.b-grade'

// cjs version
import bGradePolyfill from '@zumper/polyfill/lib/polyfill.b-grade'

// umd version
import dGradePolyfill from '@zumper/polyfill/dist/polyfill.d-grade'

// by default we export the d-grade polyfill
import alsoDGradePolyfill from '@zumper/polyfill'
```

## About the polyfills

We use [`@babel/polyfill`](https://babeljs.io/docs/en/babel-polyfill) (which in turn uses [`core-js`](https://www.npmjs.com/package/core-js)) to generate each of the polyfill files. We also include [`raf`](https://www.npmjs.com/package/raf), [`whatwg-fetch`](https://www.npmjs.com/package/whatwg-fetch), [`intersection-observer`](https://www.npmjs.com/package/intersection-observer), [`smoothscroll-polyfill`](https://www.npmjs.com/package/smoothscroll-polyfill) and a [`requestIdleCallback` shim](https://gist.github.com/paullewis/55efe5d6f05434a96c36).

We essentially build the `@babel/polyfill` four times with different settings for `@babel/preset-env` each time.

### A Grade

- last 2 chrome versions
- last 2 firefox versions
- last 1 safari version
- last 1 ios version

### B Grade

Support for [`IntersectionObserver`](https://caniuse.com/#feat=intersectionobserver), [ES6 Modules](https://caniuse.com/#feat=es6-module), and [URLSearchParams](https://caniuse.com/#search=urlsearchparams) is required to be a b-grade browser.

- chrome: 61
- firefox: 60
- ios: 12.2
- safari: 12.1
- edge: 17 (considered c-grade for `whichBundle`)

### C Grade

These are the first browsers to support both [`class`](https://caniuse.com/#feat=es6-class) and [`fetch`](https://caniuse.com/#feat=fetch).

- chrome: 49
- firefox: 46
- ios: 10.3
- safari: 10.1
- edge: 14

### D Grade

These are all of the browsers that are more-or-less the same as IE 11.

- ie 11
- chrome 38
- &gt; 0.2%
- not dead

### Missing Polyfills?

We exclude a large number of polyfills that we didn't see much use for. A future version of this polyfill may make it possible to configure this list to suit your needs. In our experience, many of the polyfills for things like regular expressions, math operations and international dates are not very useful (for our projects).
