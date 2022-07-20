const whichBundleScript = require('../whichBundleScript')
const whichPolyfillScript = require('../whichPolyfillScript')

const fs = require('fs')

fs.readFile(`./test/index.html`, 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const content = data
    .replace(
      '<script src="../dist/whichBundle.min.js"></script>',
      `<script>${whichBundleScript}</script>`
    )
    .replace(
      '<script src="../dist/whichPolyfill.min.js"></script>',
      `<script>${whichPolyfillScript}</script>`
    )

  fs.writeFile('./test/embedded.html', content, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
})
