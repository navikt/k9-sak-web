'use strict';
require('dotenv').config();
const webpack = require('webpack');
const path = require('path');

const config = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.less'],
  },

  externals: {
    canvas: 'commonjs canvas',
    cheerio: 'window',
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
    bufferutil: 'bufferutil',
    'utf-8-validate': 'utf-8-validate',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        FEATURE_TOGGLES: JSON.stringify(process.env.FEATURE_TOGGLES),
      },
    }),
  ],
};

module.exports = config;
