'use strict';

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const base = require('./webpack.base.config.js');

const merge = require('./webpack.merge');

const pro = {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
    })
  ],
  optimization: {
    // chunkIds: 'named',
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`）
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
  performance: {
    hints: 'warning'
  }
};

module.exports = merge(base, pro);
