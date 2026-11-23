/**
 * Supplerende validering for registrering av verge (aksjonspunkt 5030) i k9-tilbake og ung-tilbake.
 * Navnesjekkene kjøres i tillegg til hasValidName (`^[0-9\p{L}\p{Z}.'-]*$`) og dekker bare tegn som hasValidName godtar,
 * men som backend avviser.
 */

// k9-tilbake godtar ikke tall i navn (`^[\p{L}\p{M}\p{Z}\p{P}]*$`). Av tegnene hasValidName godtar, gjelder det bare 0-9.
export const navnUtenTallForK9Tilbake = (navn: string): string | undefined =>
  /[0-9]/.test(navn) ? 'Navn kan ikke inneholde tall' : undefined;

// ung-tilbake godtar bare latinske store og små bokstaver, og ikke linje- eller avsnittsskilletegn. Av tegnene
// hasValidName godtar, gjelder det andre bokstaver (f.eks. kyrillisk eller ª) og U+2028/U+2029.
const ikkeTillattIUngTilbakeNavn = /(?![\p{Lu}\p{Ll}])\p{L}|(?!\p{Script=Latin})\p{L}|[\p{Zl}\p{Zp}]/u;

export const navnMedLatinskeBokstaverForUngTilbake = (navn: string): string | undefined =>
  ikkeTillattIUngTilbakeNavn.test(navn) ? 'Navn kan bare inneholde latinske bokstaver' : undefined;

// hasValidOrgNumber godtar f.eks. 1234567e1, så formatet sjekkes i tillegg.
export const organisasjonsnummerMedNiSiffer = (organisasjonsnummer: string): string | undefined =>
  /^[0-9]{9}$/.test(organisasjonsnummer) ? undefined : 'Organisasjonsnummer må være 9 siffer';

/**
 * Gjør Unicode-mellomrom til vanlige mellomrom og linje-/avsnittsskilletegn til linjeskift, og fjerner mellomrom
 * først og sist. ung-tilbake godtar bare ASCII-mellomrom i begrunnelse. Samme verdi valideres og sendes.
 * Et tømt tekstfelt kan gi null.
 */
export const normaliserBegrunnelse = (begrunnelse: string | null | undefined): string =>
  (begrunnelse ?? '')
    .replace(/\p{Zs}/gu, ' ')
    .replace(/[\p{Zl}\p{Zp}]/gu, '\n')
    .trim();
