'use strict';

const webpack = require('webpack');

const commonExternals = require('./common/externals');
const commonExtensions = require('./common/extensions');

const paths = require('./util/paths');

const rules = [
  {
    test: /\.(less|css|jpg|png|svg)$/,
    loader: 'null-loader',
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
  {
    test: /\.(tsx?|ts?|jsx?)$/,
    enforce: 'pre',
    loader: 'eslint-loader',
    options: {
      failOnWarning: true,
      failOnError: true,
      configFile: paths.ESLINT_CONFIG_PATH,
      fix: false,
      cache: true,
    },
    include: [paths.PACKAGES_DIR],
  },
];

module.exports = {
  mode: 'development',
  module: {
    rules: rules,
  },
  externals: commonExternals,
  resolve: {
    extensions: commonExtensions,
  },
};
