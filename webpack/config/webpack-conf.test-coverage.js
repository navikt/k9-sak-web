'use strict';

const webpack = require('webpack');

const commonExternals = require('./common/externals');
const commonExtensions = require('./common/extensions');

const paths = require('./util/paths');
const PACKAGE = require('./../../../package.json');

const rules = [
  {
    test: /\.(less|css|jpg|png|svg)$/,
    loader: 'null-loader',
  },
  {
    test: /\.(jsx?|js?|tsx?|ts?)$/,
    include: paths.PACKAGES_DIR,
    enforce: 'post',
    loader: 'istanbul-instrumenter-loader',
    options: {
      esModules: true,
    },
  },
  {
    test: /\.(jsx?|js?|tsx?|ts?)$/,
    include: paths.PACKAGES_DIR,
    use: [
      { loader: 'cache-loader' },
      {
        loader: 'thread-loader',
        options: {
          workers: process.env.CIRCLE_NODE_TOTAL || require('os').cpus() - 1,
          workerParallelJobs: 50,
        },
      },
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
];

module.exports = {
  mode: 'development',
  devtool: 'eval',
  target: 'node',
  module: {
    rules: rules,
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(PACKAGE.version),
    }),
  ],
  externals: commonExternals,
  resolve: {
    extensions: commonExtensions,
  },
};
