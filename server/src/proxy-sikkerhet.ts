import type { OutgoingHttpHeaders } from 'node:http';

// Modulen skal ikke ha runtime-imports, slik at testene kan kjøres fra rot-vitest uten server/node_modules.

/** Stien slik backend mottar den: uten query, og med `..` og `%2e%2e` løst opp. */
export const normalisertSti = (originalUrl: string): string => new URL(originalUrl, 'http://localhost').pathname;

/** Hindrer at `..` eller `%2e%2e` sender en forespørsel ut av prefikset til proxy-ruten. */
export const erInnenforPrefiks = (originalUrl: string, prefiks: string): boolean =>
  normalisertSti(originalUrl).startsWith(`${prefiks}/`);

export const lagLoginLocation = (loginPath: string, originalUrl: string): string =>
  `${loginPath}?original=${encodeURIComponent(originalUrl)}`;

export const fjernLegitimasjon = (headers: OutgoingHttpHeaders): void => {
  delete headers['cookie'];
  delete headers['authorization'];
};
