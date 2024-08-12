/**
 * Matcher k9-formidling IdType enum i Mottaker.java
 *
 * XXX: Vurder å hente denne inn gjennom openapi generering via k9-sak K9FormidlingKodeverkWeb istadenfor å deklarere den her
 */
export type IdType = 'ORGNR' | 'AKTØRID';

/**
 * Matcher k9-formidling Mottaker class i Mottaker.java
 *
 * XXX: Vurder å hente denne inn gjennom openapi generering via k9-sak K9FormidlingKodeverkWeb istadenfor å deklarere den her
 */
export interface Mottaker {
  readonly id: string;
  readonly type: IdType;
}
