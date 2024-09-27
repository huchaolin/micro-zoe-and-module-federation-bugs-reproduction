const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const devMode = process.env.NODE_ENV !== "production";

const resolve = path.resolve;
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

module.exports = {
  entry: './src/demo', // demo页
  output: {
    path: path.resolve('./dist'),
    filename: 'common.[id].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          },
          'css-loader',
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
                localIdentName: '[local]_[hash:base64:5]',
                exportLocalsConvention: 'camel-case'
              },
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
          },
        }],
        resolve: {
          fullySpecified: false,
        },
      }
    ]
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      '@styles': resolve('src/styles'),
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      process: require.resolve('process/browser'),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/styles', to: './styles' },
      ],
    }),
    new HtmlWebpackPlugin({ template: path.join(__dirname, '../src/demo/index.html') }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    }),
    new ModuleFederationPlugin({
      name: 'RemoteLib',
      filename: 'remoteEntry.js',
      library: { type: 'umd', name: 'RemoteLib' },
      exposes: {
        '.': './src/index.js',
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
        }
      }
    }),
  ]
}