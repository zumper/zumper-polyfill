import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'
const polyfillEnv = process.env.POLYFILL_ENV
const target = `polyfill.${polyfillEnv}`
const name = `${polyfillEnv}Pollyfill`
const deps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]
const external = (name) => deps.some((dep) => name.startsWith(dep))
export default [
  // CommonJS
  {
    input: 'src/index.js',
    output: { file: `lib/${target}.js`, format: 'cjs', indent: false },
    external,
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.POLYFILL_ENV': JSON.stringify(polyfillEnv),
      }),
      commonjs(),
      babel(),
    ],
  },

  // ES
  {
    input: 'src/index.js',
    output: { file: `es/${target}.js`, format: 'es', indent: false },
    external,
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.POLYFILL_ENV': JSON.stringify(polyfillEnv),
      }),
      commonjs(),
      babel(),
    ],
  },

  // IIFE Development
  {
    input: 'src/index.js',
    output: {
      file: `dist/${target}.js`,
      format: 'iife',
      name,
      indent: false,
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.POLYFILL_ENV': JSON.stringify(polyfillEnv),
      }),
      nodeResolve(),
      commonjs(),
      babel(),
    ],
  },

  // IIFE Production
  {
    input: 'src/index.js',
    output: {
      file: `dist/${target}.min.js`,
      format: 'iife',
      name,
      indent: false,
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.POLYFILL_ENV': JSON.stringify(polyfillEnv),
      }),
      nodeResolve(),
      commonjs(),
      babel(),
      sizeSnapshot(),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },

  // IIFE Production (whichPolyfill)
  polyfillEnv === 'legacy' && {
    input: 'src/whichPolyfill.js',
    output: {
      file: `dist/whichPolyfill.min.js`,
      format: 'iife',
      name: 'whichPolyfill',
      indent: false,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel(),
      sizeSnapshot(),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
].filter(Boolean)
