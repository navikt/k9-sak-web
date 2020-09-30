'use strict';

const webpack = require('webpack');

const commonRules = require('./common/rules');
const commonPlugins = require('./common/plugins');
const commonExternals = require('./common/externals');
const commonExtensions = require('./common/extensions');

const paths = require('./util/paths');

module.exports = {
  module: {
    rules: commonRules,
  },
  plugins: [...commonPlugins, new webpack.HotModuleReplacementPlugin()],
  externals: commonExternals,
  resolve: {
    extensions: commonExtensions,
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: [
    '@babel/polyfill',
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    paths.APP_DIR + '/index.tsx',
  ],
  output: {
    path: paths.ROOT_DIR,
    publicPath: '/k9/web/',
    filename: '[name].js',
  },
  optimization: {
    namedModules: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    historyApiFallback: true,
  },
};
