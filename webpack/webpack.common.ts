import module from './common/module';
import resolve from './common/resolve';
import externals from './common/externals';
import cache from './common/cache';
import plugins from './common/plugins';

const config = {
  module,
  resolve,
  externals,
  // cache: false,
  cache,
  plugins,
};

export default config;
