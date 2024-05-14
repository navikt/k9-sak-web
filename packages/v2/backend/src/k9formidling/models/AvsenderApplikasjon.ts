import type { K9FormidlingKodeverkWeb } from '../../k9sak/generated';

/**
 * Oppretta ut frå AvsenderApplikasjon.java i k9-formidling, via openapi generert frå k9-sak
 */
export type AvsenderApplikasjon = K9FormidlingKodeverkWeb['avsenderApplikasjon'];

export const avsenderApplikasjon: Readonly<Record<AvsenderApplikasjon, AvsenderApplikasjon>> = {
  K9SAK: 'K9SAK',
  K9KLAGE: 'K9KLAGE',
  K9FORDEL: 'K9FORDEL',
  K9PUNSJ: 'K9PUNSJ',
  OMSORGSPENGER_RAMMEMELDINGER: 'OMSORGSPENGER_RAMMEMELDINGER',
};
