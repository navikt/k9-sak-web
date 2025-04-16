import * as yup from 'yup';

/*
 * Utvider Yup med egne metoder for validering
 *
 * Eksempel:
 * importer denne filen når du skal bruke yup og vil benytte disse funksjonene
 *
 *  import '@k9-sak-web/gui/utils/validation/yupSchemas';
 *
 * og benytte metoden slik:
 *
 * yup.string().validFreetextChars()
 *
 */

declare module 'yup' {
  interface StringSchema {
    validChars(validationRegex: RegExp, message?: string): this;
    isChangedComparedTo(compareTo: string): this;
  }
}

/*
 * Legger til en metode for å validere om tekst inneholder ugyldige tegn
 * Returnerer så en feilmelding som inneholder de ugyldige tegnene
 *
 * Eks:
 * import { invalidTextRegex } from '@k9-sak-web/gui/utils/validation/regexes.js';
 *
 * yup.string().validFreetextChars(invalidTextRegex);
 * yup.string().validFreetextChars(invalidTextRegex, 'Ugyldige tegn i teksten');
 */
yup.addMethod(yup.string, 'validChars', function (validationRegex: RegExp, message?: string) {
  return this.test('invalid-characters', 'Teksten inneholder ugyldige tegn: ${invalidChars}', function (value) {
    const invalidChars = findInvalidCharacters(value || '', validationRegex).join(', ');
    return (
      invalidChars.length === 0 ||
      this.createError({ message: message ?? `Teksten inneholder ugyldige tegn: ${invalidChars}` })
    );
  });
});

/*
 * Legger til en metode for å validere om en streng er endret sammenlignet med en gitt streng
 * Returnerer en feilmelding hvis strengen ikke er endret
 *
 * Eks: yup.string().isChangedComparedTo(initialValues.begrunnelse)
 */
yup.addMethod(yup.string, 'isChangedComparedTo', function (compareTo: string) {
  return this.test('is-changed', 'Innholdet er ikke endret fra tidligere.', function (value) {
    if (!value) return true; // La tomme verdier gå til andre valideringer (kanskje ikke nødvendig?)
    return value.toLowerCase() !== compareTo.toLowerCase();
  });
});

/**
 * Bruker regex sendt inn for å finne ugyldige tegn i teksten, og returnerer de ugyldige tegnene
 * @param text Streng som skal valideres
 * @param regex Regex som brukes til å finne ugyldige tegn
 * @returns Array med ugyldige tegn i teksten
 */
export const findInvalidCharacters = (text: string, regex: RegExp): string[] => {
  const matches = text.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
};
