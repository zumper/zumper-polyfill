/**
 * @author       grady@zumper.com (Grady Kuhnline)
 * @copyright    Copyright (c) 2019, Zumper
 * @description  rollup.config.js
 */

import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from '@rollup/plugin-replace'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import { terser } from 'rollup-plugin-terser'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

import pkg from './package.json'
const polyfillEnv = process.env.POLYFILL_ENV
const target = `polyfill.${polyfillEnv}`
const name = `${upperFirst(camelCase(polyfillEnv))}Pollyfill`
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
          ecma: polyfillEnv === 'd-grade' ? 5 : 6,
          pure_getters: true,
          unsafe: false,
          unsafe_arrows: polyfillEnv === 'd-grade' ? false : true,
          unsafe_comps: true,
          warnings: false,
        },
        output: {
          ecma: polyfillEnv === 'd-grade' ? 5 : 6,
        },
        safari10: polyfillEnv === 'd-grade' || polyfillEnv === 'c-grade',
      }),
    ],
  },

  // IIFE Production (whichBundle)
  polyfillEnv === 'd-grade' && {
    input: 'src/whichBundle.js',
    output: {
      file: `dist/whichBundle.min.js`,
      format: 'iife',
      name: 'whichBundle',
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
        safari10: true,
      }),
    ],
  },
  // IIFE Production (whichPolyfill)
  polyfillEnv === 'd-grade' && {
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
        safari10: true,
      }),
    ],
  },
].filter(Boolean)
