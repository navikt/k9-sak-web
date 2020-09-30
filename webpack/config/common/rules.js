const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('../util/paths');
const isDevelopmentUtil = require('../util/isDevelopment');
const isDevelopment = isDevelopmentUtil();

module.exports = [
  {
    test: /\.(jsx?|js?|tsx?|ts?)$/,
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
    include: paths.PACKAGES_DIR,
  },
  {
    test: /\.(less|css)?$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: isDevelopment ? './' : '/k9/web/',
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
          modules: {
            localIdentName: '[name]_[local]_[contenthash:base64:5]',
          },
          modifyVars: {
            nodeModulesPath: '~',
            coreModulePath: '~',
          },
        },
      },
    ],
    include: [paths.PACKAGES_DIR],
    exclude: [paths.CSS_DIR],
  },
  {
    test: /\.(less|css)?$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: isDevelopment ? './' : '/k9/web/',
        },
      },
      {
        loader: 'css-loader',
      },
      {
        loader: 'less-loader',
        options: {
          modifyVars: {
            nodeModulesPath: '~',
            coreModulePath: '~',
          },
        },
      },
    ],
    include: [paths.CSS_DIR, paths.CORE_DIR],
  },
  {
    test: /\.(jpg|png|svg)$/,
    issuer: {
      test: /\.less?$/,
    },
    loader: 'file-loader',
    options: {
      esModule: false,
      name: isDevelopment ? '[name]_[hash].[ext]' : '/[name]_[hash].[ext]',
    },
    include: [paths.IMAGE_DIR],
  },
  {
    test: /\.(svg)$/,
    issuer: {
      test: /\.(jsx|tsx)?$/,
    },
    use: [
      {
        loader: '@svgr/webpack',
      },
      {
        loader: 'file-loader',
        options: {
          esModule: false,
          name: isDevelopment ? '[name]_[hash].[ext]' : '/[name]_[hash].[ext]',
        },
      },
    ],
    include: [paths.IMAGE_DIR],
  },
  {
    test: /\.(svg)$/,
    loader: 'file-loader',
    options: {
      esModule: false,
      name: isDevelopment ? '[name]_[hash].[ext]' : '/[name]_[hash].[ext]',
    },
    include: [paths.CORE_DIR],
  },
];
