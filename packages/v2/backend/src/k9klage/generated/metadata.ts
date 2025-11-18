import packageJson from '@navikt/k9-klage-typescript-client/package.json';

const { version } = packageJson;

const [major, minor, patch] = version.split('.');

export const clientVersion = { major, minor, patch };
