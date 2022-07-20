#!/usr/bin/env node

const fs = require('fs')

const pragma = `/**
 * @type {string}
 **/
`

const createScript = (fileName) => {
  const cjsContent = `const fs = require('fs')
const path = require('path')
const data = fs.readFileSync(path.join(__dirname, 'dist', '${fileName}.min.js'))
${pragma}module.exports = data
`
  const esmContent = `
import fs from 'fs'
import path from 'path'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const data = fs.readFileSync(path.join(__dirname, 'dist', '${fileName}.min.js'))
${pragma}export default data
`

  fs.writeFile(`${fileName}Script.js`, cjsContent, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
  fs.writeFile(`${fileName}Script.mjs`, esmContent, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
}

createScript('whichBundle')
createScript('whichPolyfill')
