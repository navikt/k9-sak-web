import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import { APP_DIR } from './paths';

import cache from './common/cache';
import module from './common/module';
import plugins from './common/plugins';
import externals from './common/externals';
import resolve from './common/resolve';

import { PUBLIC_PATH } from './constants';

export default {
  mode: 'production',
  devtool: 'source-map',
  performance: { hints: false },
  entry: [APP_DIR + '/index.tsx'],
  output: {
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    path: path.resolve(__dirname, '../dist/k9/web'),
    publicPath: PUBLIC_PATH,
  },
  cache,
  module,
  plugins: plugins(),
  externals,
  resolve,
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  stats: {
    children: false,
  },
  ignoreWarnings: [/Failed to parse source map/],
};
