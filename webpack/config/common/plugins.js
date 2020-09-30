const webpack = require('webpack');
const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = require('../util/paths');
const isDevelopmentFn = require('../util/isDevelopment');
const isDevelopment = isDevelopmentFn();

module.exports = [
  new MiniCssExtractPlugin({
    filename: isDevelopment ? 'style.css' : 'style_[contenthash].css',
    ignoreOrder: true,
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    favicon: path.join(paths.ROOT_DIR, 'favicon.ico'),
    template: path.join(paths.ROOT_DIR, 'index.html'),
  }),
  new CopyWebpackPlugin([
    {
      from: paths.LANG_DIR,
      to: 'sprak/[name].[ext]',
      force: true,
      cache: {
        key: '[hash]',
      },
    },
  ]),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/),
  new CircularDependencyPlugin({
    exclude: /node_modules/,
    failOnError: true,
  }),
];
