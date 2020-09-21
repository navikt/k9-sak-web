const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PACKAGES_DIR = path.resolve(__dirname, '../../../packages');
const CORE_DIR = path.resolve(__dirname, '../../../node_modules');
const IMAGE_DIR = path.join(PACKAGES_DIR, 'assets/images');
const CSS_DIR = path.join(PACKAGES_DIR, 'assets/styles');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.(tsx?|ts?|jsx?)$/,
    enforce: 'pre',
    loader: 'eslint-loader',
    options: {
      failOnWarning: false,
      failOnError: false,
      configFile: path.resolve(__dirname, '../../../eslint/eslintrc.dev.js'),
      fix: true,
      cache: true,
      emitWarning: true,
    },
    include: [PACKAGES_DIR],
  });

  config.module.rules.push({
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
    include: PACKAGES_DIR,
  });

  config.module.rules.push({
    test: /\.(less|css)?$/,
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
  });

  config.module.rules.push({
    test: /\.(less)?$/,
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
  });

  config.module.rules.push({
    test: /\.(svg)$/,
    issuer: {
      test: /\.less?$/,
    },
    loader: 'file-loader',
    options: {
      esModule: false,
      name: '[name]_[hash].[ext]',
    },
    include: [IMAGE_DIR],
  });

  config.module.rules.push({
    test: /\.(svg)$/,
    issuer: {
      test: /\.(jsx?|js?|tsx?|ts?)?$/,
    },
    use: [
      {
        loader: '@svgr/webpack',
      },
      {
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[name]_[hash].[ext]',
        },
      },
    ],
    include: [IMAGE_DIR],
  });

  config.module.rules.push({
    test: /\.(svg)$/,
    loader: 'file-loader',
    options: {
      esModule: false,
      name: '[name]_[hash].[ext]',
    },
    include: [CORE_DIR],
  });

  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'style.css',
      ignoreOrder: true,
    }),
  );

  config.resolve.extensions.push('.ts', '.tsx', '.less');

  // Return the altered config
  return config;
};
