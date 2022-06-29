import webpack from 'webpack';
import path from 'path';

import CircularDependencyPlugin from 'circular-dependency-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ExternalTemplateRemotesPlugin from 'external-remotes-plugin';

import { IS_DEV } from '../constants';
import { PUBLIC_ROOT, LANG_DIR } from '../paths';

const PACKAGES_DIR = path.resolve(__dirname, '../packages');

const isDev = process.env.NODE_ENV === 'development';

const pluginConfig = [
  new ESLintPlugin({
    lintDirtyModulesOnly: isDev,
    context: PACKAGES_DIR,
    extensions: ['tsx', 'ts'],
    failOnWarning: false,
    failOnError: !IS_DEV,
    fix: IS_DEV,
    overrideConfigFile: path.resolve(
      __dirname,
      IS_DEV ? '../../eslint/eslintrc.dev.js' : '../../eslint/eslintrc.prod.js',
    ),
    // cache: true,
  }),
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
          transformer: (content, path) => content,
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
  new ExternalTemplateRemotesPlugin(),
];

export default pluginConfig;
