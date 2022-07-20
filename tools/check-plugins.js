const getRequiredPlugins = require('./getRequiredPlugins')

const gradedTargets = new Map()
gradedTargets.set('a-grade', [
  'last 2 chrome versions',
  'last 2 firefox versions',
  'last 1 safari version',
  'last 1 ios version',
])
gradedTargets.set('b-grade', {
  chrome: '61',
  firefox: '60',
  ios: '12.2',
  safari: '12.1',
  // edge: '17',
})
gradedTargets.set('c-grade', {
  chrome: '49',
  firefox: '46',
  ios: '10.3',
  safari: '10.1',
  edge: '14',
})
gradedTargets.set('d-grade', [
  'chrome 38',
  'ie 11',
  '>0.2%',
  'not dead',
  'not op_mini all',
])

console.log(
  'Confirming which transforms babel preset-env will apply to each browser grade.'
)
console.log(
  'These should be cross-referenced with the tests in `src/whichBundle.js`'
)
const knownPlugins = new Set()
for (const [grade, targets] of gradedTargets) {
  const plugins = Object.entries(getRequiredPlugins(targets))
    .filter(([name, required]) => {
      return required && !knownPlugins.has(name)
    })
    .map(([name]) => {
      knownPlugins.add(name)
      return `// ${name}`
    })
    .join('\n')
  console.log(grade, targets)
  console.log(plugins)
}
