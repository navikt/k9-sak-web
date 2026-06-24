/**
 * Kastet av RequestRunner i rest-api når polling overskrider maks tal forsøk.
 * Definert her i v2/gui/legacycompat slik at moderne feilvisningskode kan importere den
 * utan å bryte regelen om at v2 ikkje skal importere frå ikkje-v2 pakker.
 */
export class TimeoutError extends Error {
  readonly location: string;

  constructor(location: string) {
    super('Maximum polling attempts exceeded');
    this.location = location;
    this.name = this.constructor.name;
  }
}

export default TimeoutError;
