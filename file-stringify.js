#!/usr/bin/env node

const fs = require('fs')

const createScript = (fileName) => {
  fs.readFile(`./dist/${fileName}.min.js`, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
  
    const content = `module.exports = '${data.trim().replace(/'/g, "\\'")}'\n`

    fs.writeFile(`${fileName}Script.js`, content, err => {
      if (err) {
        console.error(err)
        return
      }
    })
  })
}

createScript('whichBundle')
createScript('whichPolyfill')
