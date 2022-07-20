/**
 * @author       grady@zumper.com (Grady Kuhnline)
 * @copyright    Copyright (c) 2022, Zumper
 * @description  getRequiredPlugins.js
 */

const data = require('@babel/compat-data/plugins')
const {
  default: getTargets,
  isBrowsersQueryValid,
  isRequired,
} = require('@babel/helper-compilation-targets')

const compatData = {
  // use the data from @babel/preset-env
  ...data,
  // Allow native template literals in recent versions of safari/ios
  // Sadly, safari 12 and ios 12.1 had a critical bug
  // https://github.com/babel/babel/issues/10740
  'transform-template-literals': {
    ...data['transform-template-literals'],
    safari: '12.1',
    ios: '12.2',
  },
}

// Copying normalizeTargets (because it is not exported)
// https://github.com/babel/babel/blob/04354d155689405ba688d4b400702710f9cccc97/packages/babel-preset-env/src/normalize-options.js#L121-L129
const normalizeTargets = (targets) => {
  // TODO: Allow to use only query or strings as a targets from next breaking change.
  if (isBrowsersQueryValid(targets)) {
    return { browsers: targets }
  }
  return {
    ...targets,
  }
}

// Test which plugins our target browsers require
module.exports = function getRequiredPlugins(targets) {
  const requiredPlugins = {}
  const currentTargets = getTargets(normalizeTargets(targets))
  for (const pluginName of Object.keys(data)) {
    requiredPlugins[pluginName] = isRequired(pluginName, currentTargets, {
      compatData,
    })
  }
  return requiredPlugins
}
