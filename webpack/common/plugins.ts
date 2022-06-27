import webpack from 'webpack';
import path from 'path';

import CircularDependencyPlugin from 'circular-dependency-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

import { IS_DEV } from '../constants';
import pck from '../../package.json';
import { PUBLIC_ROOT, LANG_DIR } from '../paths';

const { ModuleFederationPlugin } = webpack.container;

const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const deps = pck.dependencies;

const isDev = process.env.NODE_ENV === 'development';


const pluginConfig = [
  new ESLintPlugin({
    lintDirtyModulesOnly: isDev,
    context: PACKAGES_DIR,
    extensions: ['tsx', 'ts'],
    failOnWarning: false,
    failOnError: !IS_DEV,
    fix: IS_DEV,
    overrideConfigFile: path.resolve(__dirname, IS_DEV ? '../../eslint/eslintrc.dev.js' : '../../eslint/eslintrc.prod.js'),
    // cache: true,
  }),
  new MiniCssExtractPlugin({
    filename: 'style_[contenthash].css',
    ignoreOrder: true,
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    favicon: path.join(PUBLIC_ROOT, 'favicon.ico'),
    template: path.join(PUBLIC_ROOT, 'index.html'),
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: LANG_DIR,
        to: 'sprak/[name][ext]',
        force: true,
        transform: {
          transformer: (content, path) => content,
          cache: {
            keys: {
              key: '[contenthash]',
            },
          },
        },
      },
    ],
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/),
  new CircularDependencyPlugin({
    exclude: /node_modules/,
    failOnError: true,
  })
]

if (isDev) {
  // @ts-ignore
  pluginConfig.push(new ModuleFederationPlugin({
    name: "ft_frontend_saksbehandling",
    remotes: {
      ft_prosess_beregningsgrunnlag: 'ft_prosess_beregningsgrunnlag@http://localhost:9008/remoteEntry.js?[(new Date).getTime()]',
    },
    shared: {
      react: {
        singleton: true,
        requiredVersion: deps.react,
      },
      "react-dom": {
        singleton: true,
        requiredVersion: deps["react-dom"],
      },
    },
  }))
}

export default pluginConfig;
