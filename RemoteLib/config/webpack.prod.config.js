const baseConfig = require('./webpack.base.config');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  ...baseConfig,
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        },
        extractComments: false,
      })
    ]
  }
};