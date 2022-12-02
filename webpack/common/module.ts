import path from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { MODULES_DIR, PACKAGES_DIR, CSS_DIR, IMAGE_DIR } from '../paths';

import { IS_DEV } from '../constants';

const babelRules = {
  test: /\.(t|j)sx?$/,
  use: [
    {
      loader: 'thread-loader',
      options: {
        workers: process.env.CIRCLE_NODE_TOTAL || require('os').cpus().length - 1,
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
  include: [PACKAGES_DIR],
};

const lessLocalRules = {
  test: /\.(le|c)ss$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: IS_DEV ? './' : '/k9/web/',
      },
    },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: {
          localIdentName: '[name]_[local]_[contenthash:base64:5]',
        },
      },
    },
    {
      loader: 'less-loader',
      options: {
        lessOptions: {
          modules: true,
          localIdentName: '[name]_[local]_[contenthash:base64:5]',
          modifyVars: {
            nodeModulesPath: '~',
            coreModulePath: '~',
          },
        },
      },
    },
  ],
  include: [PACKAGES_DIR],
  exclude: [CSS_DIR],
};

const lessExternalRules = {
  test: /\.(le|c)ss$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: IS_DEV ? './' : '/k9/web/',
      },
    },
    { loader: 'css-loader' },
    {
      loader: 'less-loader',
      options: {
        lessOptions: {
          modifyVars: {
            nodeModulesPath: '~',
            coreModulePath: '~',
          },
        },
      },
    },
  ],
  include: [CSS_DIR, MODULES_DIR],
};

const assetRules = {
  test: /\.(jp|pn|sv)g$/,
  issuer: /\.less$/,
  type: 'asset/resource',
  generator: {
    filename: '[name]_[contenthash].[ext]',
  },
  include: [IMAGE_DIR],
};

const svgLocalRules = {
  test: /\.(svg)$/,
  issuer: /\.(t|j)sx?$/,
  use: [
    { loader: '@svgr/webpack' },
    {
      loader: 'file-loader',
      options: {
        esModule: false,
        name: IS_DEV ? '[name]_[contenthash].[ext]' : '/[name]_[contenthash].[ext]',
      },
    },
  ],
  type: 'javascript/auto',
  include: [IMAGE_DIR],
};

const svgExternalRules = {
  test: /\.(svg)$/,
  type: 'asset/resource',
  generator: {
    filename: '[name]_[contenthash].[ext]',
  },
  include: [MODULES_DIR],
};

const sourceMaps = {
  test: /\.js$/,
  enforce: 'pre',
  use: ['source-map-loader'],
  include: [`${MODULES_DIR}/@navikt`],
};

export default {
  rules: [sourceMaps, babelRules, lessLocalRules, lessExternalRules, assetRules, svgLocalRules, svgExternalRules],
};
