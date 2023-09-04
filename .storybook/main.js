import { dirname, join } from 'path';
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const CORE_DIR = path.resolve(__dirname, '../node_modules');
const IMAGE_DIR = path.join(PACKAGES_DIR, 'assets/images');
const CSS_DIR = path.join(PACKAGES_DIR, 'assets/styles');
module.exports = {
  stories: ['../packages/storybook/stories/**/*.stories.@(j|t)s?(x)'],
  addons: [
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        csfPluginOptions: null,
      },
    },
    // Burde bytte ut alle knobs osv med controls
    // ref: https://medium.com/storybookjs/storybook-6-migration-guide-200346241bb5
    // '@storybook/addon-essentials',
  ],

  // reactOptions: {
  //   fastRefresh: true,
  // },
  webpackFinal: async (config, { configType }) => {
    // Fjern default svg-loader
    config.module.rules = config.module.rules.map(data => {
      if (/svg\|/.test(String(data.test))) {
        data.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;
      }
      return data;
    });
    config.devtool = configType === 'DEVELOPMENT' ? 'inline-source-map' : 'source-map';

    // Make whatever fine-grained changes you need
    config.module.rules = config.module.rules.concat(
      {
        test: /\.(t|j)sx?$/,
        use: [
          {
            loader: 'cache-loader',
          },
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
        include: PACKAGES_DIR,
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
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
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
            },
          },
          {
            loader: 'css-loader',
          },
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
        include: [CSS_DIR, CORE_DIR],
      },
      {
        test: /\.(jp|pn|sv)g$/,
        issuer: /\.less?$/,
        type: 'asset/resource',
        generator: {
          filename: '[name]_[contenthash].[ext]',
        },
        include: [IMAGE_DIR],
      },
      {
        test: /\.(svg)$/,
        issuer: /\.(t|j)sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
          },
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: '[name]_[contenthash].[ext]',
            },
          },
        ],
        type: 'javascript/auto',
        include: [IMAGE_DIR],
      },
      {
        test: /\.(svg)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name]_[contenthash].[ext]',
        },
        include: [CORE_DIR],
      },
    );
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'style[name].css',
        ignoreOrder: true,
      }),
    );
    config.resolve.extensions.push('.ts', '.tsx', '.less');

    // Return the altered config
    return config;
  },
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
