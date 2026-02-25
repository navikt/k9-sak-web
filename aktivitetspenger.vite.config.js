import { loadEnv, mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import baseConfig from './ung.vite.config.js';

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, `${process.cwd()}/envDir/ung`) };
    return mergeConfig(baseConfig({ mode }), defineConfig({
        server: {
            port: 9010,
        },
    }));
};

