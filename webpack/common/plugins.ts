import webpack from 'webpack';
import path from 'path';

import CircularDependencyPlugin from 'circular-dependency-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

import { IS_DEV, IS_PROD } from '../constants';
import { PUBLIC_ROOT, LANG_DIR } from '../paths';

const PACKAGES_DIR = path.resolve(__dirname, '../packages');

export default function (env?) {
  const isCIBuild = env?.ci === 'true';
  return [
    new ESLintPlugin({
      lintDirtyModulesOnly: IS_DEV,
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
    IS_PROD || isCIBuild
      ? new CircularDependencyPlugin({
          exclude: /node_modules/,
          failOnError: true,
        })
      : false,
    new webpack.EnvironmentPlugin({ SENTRY_RELEASE: null }),
  ].filter(Boolean);
}
