import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
require('dotenv').config();

import { PUBLIC_ROOT, APP_DIR } from './paths';

import module from './common/module';
import resolve from './common/resolve';
import externals from './common/externals';
import cache from './common/cache';
import plugins from './common/plugins';
import devServer from './common/devServer';

import { PUBLIC_PATH } from './constants';

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: [APP_DIR + '/index.tsx'],
  output: {
    path: PUBLIC_ROOT,
    publicPath: PUBLIC_PATH,
    filename: '[name].js',
  },
  module,
  resolve,
  externals,
  cache,
  plugins: [
    ...plugins,
    new ReactRefreshWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      MSW_MODE: 'development',
      ENDRINGSLOGG_URL: ' https://familie-endringslogg.dev.intern.nav.no',
    }),
  ],
  optimization: {
    moduleIds: 'named',
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer,
};
