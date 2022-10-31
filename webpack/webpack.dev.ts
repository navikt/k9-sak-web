import webpack from 'webpack';

import { PUBLIC_ROOT, APP_DIR } from './paths';

import modules from './common/module';
import resolve from './common/resolve';
import externals from './common/externals';
import cache from './common/cache';
import plugins from './common/plugins';
import devServer from './common/devServer';
import pck from '../package.json';

import { PUBLIC_PATH } from './constants';

const deps = pck.dependencies;
const { ModuleFederationPlugin } = webpack.container;

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
    new ModuleFederationPlugin({
      name: 'ft_frontend_saksbehandling',
      remotes: {
        ft_prosess_beregningsgrunnlag:
          'ft_prosess_beregningsgrunnlag@http://localhost:9008/remoteEntry.js?[(new Date).getTime()]',
        ft_fakta_beregning: 'ft_fakta_beregning@http://localhost:9006/remoteEntry.js?[(new Date).getTime()]',
        ft_fakta_fordel_beregningsgrunnlag:
          'ft_fakta_fordel_beregningsgrunnlag@http://localhost:9007/remoteEntry.js?[(new Date).getTime()]',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
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
});
