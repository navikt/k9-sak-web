import webpack from 'webpack';

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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin({
      MSW_MODE: 'development',
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
