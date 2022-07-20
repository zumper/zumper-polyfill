const getRequiredPlugins = require('./getRequiredPlugins')
const { gradedTargets } = require('./gradedTargets.js')

console.log(
  'Confirming which transforms babel preset-env will apply for each browser grade.'
)
console.log(
  'These should be cross-referenced with the tests in `src/whichBundle.js`'
)
const knownPlugins = new Set()
for (const [grade, targets] of gradedTargets) {
  if (grade === 'b-grade' && targets.edge) {
    // edge 17 is not b-grade for syntax
    delete targets.edge
  }
  const plugins = Object.entries(getRequiredPlugins(targets))
    .filter(([name, required]) => {
      return required && !knownPlugins.has(name)
    })
    .map(([name]) => {
      knownPlugins.add(name)
      return `  // ${name}`
    })
    .join('\n')
  console.log(grade, targets)
  console.log(plugins)
}
