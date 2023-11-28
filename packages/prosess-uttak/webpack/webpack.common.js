/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssExtractLoaderConfig = {
  loader: MiniCssExtractPlugin.loader,
};

const nodeModules = path.resolve(__dirname, '../node_modules');
const rootNodeModules = path.resolve(__dirname, '../../../node_modules');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          cssExtractLoaderConfig,
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
        exclude: [nodeModules, rootNodeModules],
      },
      {
        test: /\.(less|css)?$/,
        use: [
          cssExtractLoaderConfig,
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
        include: [nodeModules, rootNodeModules],
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],
};
