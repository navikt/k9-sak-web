import { Period } from '@k9-sak-web/utils';
import { Dayjs } from 'dayjs';
import { tomorrow } from '../../../constants/dateConstants';
import { dateFromString } from '../../../util/dateUtils';

export function required(v: string | number): string | boolean {
  if (v === null || v === undefined || v === '') {
    return 'Du må oppgi en verdi';
  }
  return true;
}

export function dateIsNotInTheFuture(dateString: string): string | boolean {
  const date: Dayjs = dateFromString(dateString);
  if (date.isSame(tomorrow) || date.isAfter(tomorrow)) {
    return 'Datoen kan ikke settes senere enn dagens dato';
  }
  return true;
}

export const detErTilsynsbehovPåDatoen = (dato: string, perioderMedTilsynsbehov: Period[]): string | boolean => {
  const detErTilsynsbehovPåDato = perioderMedTilsynsbehov.some(periode =>
    new Period(periode.fom, periode.tom).includesDate(dato),
  );
  if (detErTilsynsbehovPåDato) {
    return true;
  }
  return 'Dato må være innenfor en periode med tilsynsbehov';
};

export const datoenInngårISøknadsperioden = (dato: string, søknadsperiode: Period): string | boolean => {
  if (søknadsperiode.includesDate(dato)) {
    return true;
  }

  return 'Dato må være innenfor søknadsperioden';
};

export const detErIngenInnleggelsePåDato = (dato: string, innleggelsesperioder: Period[]): string | boolean => {
  const detErInnleggelsePåDato = innleggelsesperioder.some(periode =>
    new Period(periode.fom, periode.tom).includesDate(dato),
  );
  if (detErInnleggelsePåDato) {
    return 'Dato må være utenfor innleggelsesperioden(e)';
  }
  return true;
};

export const datoErInnenforResterendeVurderingsperioder = (
  dato: string,
  resterendeVurderingsperioder: Period[],
): string | true => {
  const datoErInnenfor = resterendeVurderingsperioder.some(period =>
    new Period(period.fom, period.tom).includesDate(dato),
  );

  if (datoErInnenfor) {
    return true;
  }

  return 'Dato må være innenfor periodene som vurderes';
};

export const fomDatoErFørTomDato = (periode: Period): string | true => {
  const fom = dateFromString(periode.fom);
  const tom = dateFromString(periode.tom);

  if (fom.isAfter(tom)) {
    return 'Fra-dato må være før til-dato';
  }

  return true;
};
