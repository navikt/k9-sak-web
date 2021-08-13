const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const commonDevAndProd = require('./webpack.common');

const ROOT_DIR = path.resolve(__dirname, '../public/client');
const PACKAGES_DIR = path.join(__dirname, '../packages');
const APP_DIR = path.resolve(PACKAGES_DIR, 'sak-app/src');

const config = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: [
    '@babel/polyfill',
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    APP_DIR + '/index.tsx',
  ],
  output: {
    path: ROOT_DIR,
    publicPath: '/k9/web/',
    filename: '[name].js',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
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

module.exports = merge(commonDevAndProd, config);
