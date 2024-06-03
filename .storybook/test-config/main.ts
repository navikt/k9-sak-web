import config from '../main';

const testConfig = { ...config, stories: ['../../packages/**/*.stories.@(j|t)s?(x)'], staticDirs: ['../../public'] };

export default testConfig;
