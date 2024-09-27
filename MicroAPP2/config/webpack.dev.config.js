'use strict';
const merge = require('./webpack.merge');
const path = require('path');
// const fs = require('fs');
const base = require('./webpack.base.config');

const port = 8083;

const baseHref = `/micro-app-2/`;


const devServer = {
  hot: true,
  open: [baseHref],
  historyApiFallback: true,
  client: {
    logging: 'info',
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  allowedHosts: 'all',
  static: {
    directory: path.join(__dirname, 'public'),
  },
  port,
  proxy: [
    //  如需本地联调cc-lib
    {
      context: [`/remote-lib/**`],
      target: 'http://localhost:8081',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        [`/remote-lib/`]: '/',
      },
    },
  
    {
      context: [baseHref],
      target: 'http://localhost:' + port,
      pathRewrite: {
        [`^${baseHref}`]: '/'
      },
      secure: false,
    }
  ]
};

const dev = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer,
};
module.exports = merge(base, dev);
