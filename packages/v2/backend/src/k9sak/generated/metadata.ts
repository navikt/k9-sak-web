import { OpenAPI } from '@navikt/k9-sak-typescript-client/core/OpenAPI.js';

const version = OpenAPI.VERSION;

const [major, minor] = version.split('.');

export const clientVersion = { major, minor };
