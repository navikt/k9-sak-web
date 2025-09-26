import packageJson from '@navikt/ung-sak-typescript-client/package.json';

const { version } = packageJson;

const [major, minor, patch] = version.split('.');

export const clientVersion = { major, minor, patch };
