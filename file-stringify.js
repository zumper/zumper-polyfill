#!/usr/bin/env node

const fs = require('fs')

const pragma = `/**
 * @type {string}
 **/
`

const createScript = (fileName) => {
  fs.readFile(`./dist/${fileName}.min.js`, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const content = JSON.stringify(data.replace(/\\n/g, '\\\\n').trim())
    const cjsContent = `${pragma}module.exports = ${content}\n`
    const esmContent = `${pragma}export default ${content}\n`

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
  })
}

createScript('whichBundle')
createScript('whichPolyfill')
