import { Period } from '@navikt/k9-period-utils';
import { initializeDate, dateConstants } from '@navikt/k9-date-utils';
import { Dayjs } from 'dayjs';
import { finnHullIPerioder } from '../../../util/periodUtils';

type InputValue = string | number;

export function required(v: InputValue): string | boolean {
    if (v === null || v === undefined || v === '') {
        return 'Du må oppgi en verdi';
    }
    return true;
}

export function dateIsNotInTheFuture(dateString: string): string | boolean {
    const date: Dayjs = initializeDate(dateString);
    if (date.isSame(dateConstants.tomorrow) || date.isAfter(dateConstants.tomorrow)) {
        return 'Datoen kan ikke settes senere enn dagens dato';
    }
    return true;
}

export const detErTilsynsbehovPåDatoen = (dato: string, perioderMedTilsynsbehov: Period[]): string | boolean => {
    const detErTilsynsbehovPåDato = perioderMedTilsynsbehov.some((periode) =>
        new Period(periode.fom, periode.tom).includesDate(dato)
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
    const detErInnleggelsePåDato = innleggelsesperioder.some((periode) =>
        new Period(periode.fom, periode.tom).includesDate(dato)
    );
    if (detErInnleggelsePåDato) {
        return 'Dato må være utenfor innleggelsesperioden(e)';
    }
    return true;
};

export const datoErInnenforResterendeVurderingsperioder = (
    dato: string,
    resterendeVurderingsperioder: Period[]
): string | true => {
    const datoErInnenfor = resterendeVurderingsperioder.some((period) =>
        new Period(period.fom, period.tom).includesDate(dato)
    );

    if (datoErInnenfor) {
        return true;
    }

    return 'Dato må være innenfor periodene som vurderes';
};

export const datoErIkkeIEtHull = (dato: string, perioder: Period[]): string | true => {
    if (perioder.length === 1) {
        return true;
    }
    const hull: Period[] = finnHullIPerioder(perioder);
    const datoErIetHull = hull.some((period) => period.includesDate(dato));

    if (datoErIetHull) {
        return 'Dato må være innenfor periodene som skal vurderes';
    }
    return true;
};

export const harBruktDokumentasjon = (dokumenter: []): string | true => {
    if (dokumenter.length === 0) {
        return 'Du må ha brukt ett eller flere dokumenter i vurderingen';
    }
    return true;
};

export const fomDatoErFørTomDato = (periode: Period): string | true => {
    const fom = initializeDate(periode.fom);
    const tom = initializeDate(periode.tom);

    if (fom.isAfter(tom)) {
        return 'Fra-dato må være før til-dato';
    }

    return true;
};
