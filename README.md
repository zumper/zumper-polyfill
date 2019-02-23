# Zumper polyfill

Package containing prebuilt polyfills for use in Zumper's React applications. The polyfill is broken into three versions to ensure that we deliver a more appropriate pollyfill based on the user's browser.

This polyfill is designed to work differently than [`@babel/polyfill`](https://babeljs.io/docs/en/babel-polyfill) and [`react-app-polyfill`](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill). Instead of including `@zumper/polyfill` at the top of your entrypoint, you need to run code on the client to figure out which polyfill should load before initializing your app.

Instead of having just one polyfill, we decided to build three polyfills so that browsers with more capabilities will get a smaller file. This is similar in concept to what [polyfill.io](https://polyfill.io/v2/docs/) offers. However, instead of supporting an infinite number of polyfill combinations, we chose the three groupings that seemed to balance file size well enough to suit our needs.

- **Current:** the latest features; requires very few polyfills.
- **Recent:** fairly new; needs more polyfills.
- **Legacy:** needs the most polyfills.

## Install

```bash
yarn add @zumper/polyfill
```

## Usage

Unlike other polyfills, `@zumper/polyfill` takes some additional setup. It is designed to work with Zumper's code building strategy and may not suit all use cases. If you are looking for a simple polyfill solution, try [`@babel/polyfill`](https://babeljs.io/docs/en/babel-polyfill).

### Including the polyfills in your build

We ship a prebuilt polyfill in the `dist` folder. Rather than specifying the polyfills as endpoints in your webpack config, it is recommended to use [`copy-webpack-plugin`](https://github.com/webpack-contrib/copy-webpack-plugin) to copy the prebuilt versions to your output.

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

We also ship a `whichPolyfill` function in the `dist` folder. This function will identify the right polyfill for the current browser using feature detection. It is recommended to use the [`raw-loader`](https://github.com/webpack-contrib/raw-loader) in your server-side-rendering code to import that file as a string and embed it in your output HTML.

```js
import whichPolyfill from 'raw-loader!@zumper/polyfill/dist/whichPolyfill.min.js'

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
  href="https://cdn.example.com/js/runtime~main.js"
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
      'https://cdn.example.com/js/runtime~main.js',
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
import currentPolyfill from '@zumper/polyfill/es/polyfill.current'

// cjs version
import recentPolyfill from '@zumper/polyfill/lib/polyfill.recent'

// umd version
import legacyPolyfill from '@zumper/polyfill/dist/polyfill.legacy'

// by default we export the legacy polyfill
import alsoLegacyPolyfill from '@zumper/polyfill'
```

## About the polyfills

We use [`@babel/polyfill`](https://babeljs.io/docs/en/babel-polyfill) (which in turn uses [`core-js`](https://www.npmjs.com/package/core-js)) to generate each of the three polyfill files. We also include [`raf`](https://www.npmjs.com/package/raf), [`whatwg-fetch`](https://www.npmjs.com/package/whatwg-fetch), [`intersection-observer`](https://www.npmjs.com/package/intersection-observer) and a [`requestIdleCallback` shim](https://gist.github.com/paullewis/55efe5d6f05434a96c36).

We essentially build the `@babel/polyfill` three times with different settings for `@babel/preset-env` each time.

### Current

- chrome 58
- firefox 55
- edge 15

Notice that no version of Safari makes the cut. Essentially, support for `IntersectionObserver` is required to be considered a "current" browser.

### Recent

- chrome 49
- firefox 45
- safari 10.1
- edge 14

These are the first browsers to support both `class` and `fetch`.

### Legacy

- &gt; 0.2%
- not dead
- ie 11
- chrome 41

These are all of the browsers that are more or less the same as IE 11. We make sure to target [chrome 41 specifically](https://developers.google.com/search/docs/guides/rendering).

We also exclude a large number of polyfills that we didn't see much use for. A future version of this polyfill may make it possible to configure this list to suit your needs. In our experience, many of the polyfills for things like regular expressions, math operations and international dates are not very useful (for our projects).
