const { NODE_ENV, POLYFILL_ENV } = process.env
const loose = true

let targets
switch (POLYFILL_ENV) {
  case 'current':
    // first browsers with "full" es6 support
    targets = {
      chrome: '58',
      firefox: '55',
      edge: '15',
    }
    break
  case 'recent':
    // first browsers with `class` and support for fetch
    targets = {
      chrome: '49',
      firefox: '45',
      safari: '10.1',
      edge: '14',
    }
    break
  case 'legacy':
    targets = ['>0.2%', 'not dead', 'ie 11', 'chrome 41']
    break
}

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets,
        loose,
        modules: false,
        exclude: [
          'es6.array.copy-within',
          'es6.array.fill',
          // 'es6.array.from',
          'es6.array.of',
          'es6.array.species',
          'es6.date.*',
          'es6.function.has-instance',
          'es6.math.*',
          'es6.number.*',
          // 'es6.object.freeze',
          'es6.object.get-prototype-of',
          'es6.object.is',
          'es6.object.is-extensible',
          // 'es6.object.is-frozen',
          // 'es6.object.is-sealed',
          'es6.object.prevent-extensions',
          // 'es6.object.seal',
          'es6.object.set-prototype-of',
          'es6.reflect.*',
          'es6.regexp.*',
          'es6.string.anchor',
          'es6.string.big',
          'es6.string.blink',
          'es6.string.bold',
          'es6.string.code-point-at',
          'es6.string.fixed',
          'es6.string.from-code-point',
          'es6.string.fontcolor',
          'es6.string.fontsize',
          'es6.string.italics',
          'es6.string.link',
          'es6.string.raw',
          'es6.string.small',
          'es6.string.strike',
          'es6.string.sub',
          'es6.string.sup',
          'es6.typed.*',
          'es7.object.define-getter',
          'es7.object.define-setter',
          'es7.object.lookup-getter',
          'es7.object.lookup-setter',
          'es7.string.pad-end',
          'es7.string.pad-start',
          'transform-regenerator',
          'web.immediate',
        ],
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread', { loose }],
    '@babel/transform-react-jsx',
  ].filter(Boolean),
}
