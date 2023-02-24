import webpack from 'webpack';

import { PUBLIC_ROOT, APP_DIR } from './paths';

import modules from './common/module';
import resolve from './common/resolve';
import externals from './common/externals';
import cache from './common/cache';
import plugins from './common/plugins';
import devServer from './common/devServer';
import { PUBLIC_PATH } from './constants';

module.exports = env => ({
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: [APP_DIR + '/index.tsx'],
  output: {
    path: PUBLIC_ROOT + '/src',
    publicPath: PUBLIC_PATH,
    filename: '[name].js',
  },
  module: modules,
  resolve,
  externals,
  cache,
  plugins: [
    ...plugins(env),
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
  ignoreWarnings: [/Failed to parse source map/],
});
