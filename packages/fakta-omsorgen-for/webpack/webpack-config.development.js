/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const commonWebpackConfig = require('./webpack.common.js');

const webpackConfig = merge(commonWebpackConfig, {
  entry: `${path.resolve(__dirname, '../', 'src')}/dev/app.ts`,
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
    }),
  ],
});

const port = 8484;
const devServerOptions = {
  hot: true,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:9000',
  },
  port,
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
