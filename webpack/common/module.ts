import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { CSS_DIR, IMAGE_DIR, NODE_MODULES, PACKAGES_DIR } from '../paths';

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
  test: /\.css$/,
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
    'postcss-loader',
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
  include: [CSS_DIR, NODE_MODULES],
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
  include: [NODE_MODULES],
};

const sourceMaps = {
  test: /\.js$/,
  enforce: 'pre',
  use: ['source-map-loader'],
  include: [`${NODE_MODULES}/@navikt`],
};

export default {
  rules: [sourceMaps, babelRules, lessLocalRules, lessExternalRules, assetRules, svgLocalRules, svgExternalRules],
};
