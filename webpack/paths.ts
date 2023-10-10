import path from 'path';

export const NODE_MODULES = path.resolve(__dirname, '../node_modules');
export const PUBLIC_ROOT = path.resolve(__dirname, '../public/client');
export const LANG_DIR = path.resolve(__dirname, '../public/sprak/');
export const PACKAGES_DIR = path.join(__dirname, '../packages');
export const APP_DIR = path.resolve(PACKAGES_DIR, 'sak-app/src');
export const CSS_DIR = path.join(PACKAGES_DIR, 'assets/styles');
export const IMAGE_DIR = path.join(PACKAGES_DIR, 'assets/images');
