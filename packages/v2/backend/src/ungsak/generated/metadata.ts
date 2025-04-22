import { OpenAPI } from '@navikt/ung-sak-typescript-client/core/OpenAPI.js';
const version = OpenAPI.VERSION;
const [major, minor] = version.split('.');
export const clientVersion = { major, minor };
