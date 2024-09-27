'use strict';
const merge = require('./webpack.merge');
const path = require('path');
const base = require('./webpack.base.config');

const port = 8084;

const baseHref = `/host-app/`;


const devServer = {
  hot: true,
  open: [`${baseHref}micro-app-2`],
  historyApiFallback: {
    rewrites: [
      { from: /^\/host-app/, to: '/host-app/index.html' },
    ],
  },
  
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
      context: [`/micro-app-1/**`],
      target: 'http://localhost:8082',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        [`/micro-app-1/`]: '/',
      },
    },
    {
      context: [`/micro-app-2/**`],
      target: 'http://localhost:8083',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        [`/micro-app-2/`]: '/',
      },
    },
  ]
};

const dev = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer,
};
module.exports = merge(base, dev);
