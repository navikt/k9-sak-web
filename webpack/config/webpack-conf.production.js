'use strict';

const webpack = require('webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const commonRules = require('./common/rules');
const commonPlugins = require('./common/plugins');
const commonExternals = require('./common/externals');
const commonExtensions = require('./common/extensions');

const paths = require('./util/paths');

module.exports = {
  module: {
    rules: commonRules,
  },
  plugins: commonPlugins,
  externals: commonExternals,
  resolve: {
    extensions: commonExtensions,
  },
  mode: 'production',
  devtool: 'source-map',
  performance: { hints: false },
  entry: ['@babel/polyfill', paths.APP_DIR + '/index.tsx'],
  output: {
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    path: path.resolve(__dirname, '../../../dist/k9/web'),
    publicPath: '/k9/web/',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  stats: {
    children: false,
  },
};
