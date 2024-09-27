const { mergeWithCustomize, unique } = require('webpack-merge');
const merge = mergeWithCustomize(
  {
    customizeArray: unique(
      'plugins',
      ['HotModuleReplacementPlugin'],
      (plugin) => plugin.constructor && plugin.constructor.name
    ),
    customizeObject(a, b, key) {
      return { ...a, ...b };
    }
  });

module.exports = merge;