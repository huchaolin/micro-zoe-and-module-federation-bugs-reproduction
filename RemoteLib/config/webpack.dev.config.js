const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');

const baseHref = '/remote-lib/';

const path = require('path');
const port = 8081;
module.exports = {
  ...baseConfig,
  entry: {
    index: [
      path.join(__dirname, '../src/demo'),
    ]
  },
  
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: port,
    hot: false,
    open: [baseHref],
    historyApiFallback: true,
   
    proxy:[
      {
        context: [baseHref],
        target: 'http://localhost:' + port,
        pathRewrite: {
          [`^${baseHref}`]: '/'
        }
      }
    ],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
  ]
};