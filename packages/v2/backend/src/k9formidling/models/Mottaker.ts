/**
 * Matcher k9-formidling IdType enum i Mottaker.java
 *
 * XXX: Vurder å hente denne inn gjennom openapi generering via k9-sak K9FormidlingKodeverkWeb istadenfor å deklarere den her
 */
export type IdType = 'ORGNR' | 'AKTØRID';

export type UtilgjengeligÅrsak = 'PERSON_DØD' | 'ORG_OPPHØRT';

export const utilgjengeligÅrsaker: Record<UtilgjengeligÅrsak, UtilgjengeligÅrsak> = {
  PERSON_DØD: 'PERSON_DØD',
  ORG_OPPHØRT: 'ORG_OPPHØRT',
} as const;

/**
 * Matcher k9-formidling Mottaker class i Mottaker.java
 *
 * XXX: Vurder å hente denne inn gjennom openapi generering via k9-sak K9FormidlingKodeverkWeb istadenfor å deklarere den her
 */
export interface Mottaker {
  readonly id: string;
  readonly type: IdType;
  readonly utilgjengelig?: UtilgjengeligÅrsak;
}
