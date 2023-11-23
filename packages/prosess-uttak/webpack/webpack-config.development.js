/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const commonWebpackConfig = require('./webpack.common');

const webpackConfig = merge(commonWebpackConfig, {
  entry: `${path.resolve(__dirname, '../', 'src')}/dev/app.ts`,
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
    }),
    new ReactRefreshWebpackPlugin(),
    new webpack.EnvironmentPlugin({ MSW_MODE: 'development' }),
  ],
});

const port = 8081;
const devServerOptions = {
  hot: true,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:9000',
  },
  port,
  static: {
    directory: path.resolve(__dirname, '../../../dist'),
  },
};

const compiler = webpack(webpackConfig);
const devServer = new WebpackDevServer(devServerOptions, compiler);
compiler.close(() => console.info('Compiler closed'));

devServer.startCallback(error => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Listening at port ${port}`);
  }
});
