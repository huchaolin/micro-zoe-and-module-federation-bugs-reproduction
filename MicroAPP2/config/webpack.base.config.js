'use strict';

const webpack = require('webpack');

const { ModuleFederationPlugin } = webpack.container;

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

const loaderInculdePaths = [
  path.join(__dirname, '../src'),
];

const config = {
  entry: {
    index: [
      path.join(__dirname, '../src/index.js'),
    ]
  },
  output: {
    path: path.join(__dirname, '../dist'),
    // 如果是同步模块的时候，一般命名为bundle
    filename: 'bundle.[contenthash].js',
    // 如果是动态引入，一般命名为chunk
    chunkFilename: 'chunk.[contenthash].[name].js',
    publicPath: '',
    clean: true,  // 清理 /dist 文件夹
    hashDigestLength: 10,
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        include: loaderInculdePaths,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/preset-env",
              ['@babel/preset-react', { runtime: 'automatic' }],
              "@babel/preset-typescript",
            ],
          },
        }]
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
                auto: /\.module(s)?\.\w+$/i,
                localIdentName: '[local]_[hash:base64:8]',
                exportLocalsConvention: 'camelCase'
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,  // 匹配所有常见的字体文件类型
        type: 'asset/resource',                // 将字体文件输出到构建目录
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
          }
        }
      }
    ],
  },

  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      'lodash': 'lodash-es',
      '@components': path.join(__dirname, '../src/components'),
      '@modules': path.join(__dirname, '../src/modules'),
      'stream': 'stream-browserify',
    },
    fallback: {
      crypto: false,
      'crypto-browserify': require.resolve('crypto-browserify'),
      "vm": require.resolve("vm-browserify")
      // "buffer": false,
      // stream: false,
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'RemoteLib',
      remotes: {
        // RemoteLib: 'RemoteLib@/remote-lib/remoteEntry.js',
        RemoteLib: `promise new Promise(resolve => {
      const urlParams = new URLSearchParams(window.location.search)
      const version = urlParams.get('app1VersionParam')
      // This part depends on how you plan on hosting and versioning your federated modules
      const remoteUrlWithVersion = '/remote-lib/remoteEntry.js'
      const script = document.createElement('script')
      script.src = remoteUrlWithVersion
      script.onload = () => {
        // the injected script has loaded and is available on window
        // we can now resolve this Promise
        const proxy = {
          get: (request) => window.RemoteLib.get(request),
          init: (...arg) => {
            try {
              return window.RemoteLib.init(...arg)
            } catch(e) {
              console.log('remote container already initialized')
            }
          }
        }
        resolve(proxy)
      }
      // inject this script with the src set to the versioned remoteEntry.js
      document.head.appendChild(script);
    })
    `,
      },
      
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: false,
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: false,
        },
        'antd': {
          singleton: true,
          requiredVersion: false,
        },
      }
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({ template: path.join(__dirname, '../src/index.html') }),
  ],
};


module.exports = config;
