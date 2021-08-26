import webpack from 'webpack';
import path from 'path';

import CircularDependencyPlugin from 'circular-dependency-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import { PUBLIC_ROOT, LANG_DIR } from '../paths';

export default [
  new MiniCssExtractPlugin({
    filename: 'style_[contenthash].css',
    ignoreOrder: true,
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    favicon: path.join(PUBLIC_ROOT, 'favicon.ico'),
    template: path.join(PUBLIC_ROOT, 'index.html'),
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: LANG_DIR,
        to: 'sprak/[name][ext]',
        force: true,
        transform: {
          cache: {
            keys: {
              key: '[contenthash]',
            },
          },
        },
      },
    ],
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/),
  new CircularDependencyPlugin({
    exclude: /node_modules/,
    failOnError: true,
  }),
];
