import { Period } from '@navikt/k9-period-utils';
import Dokument from './Dokument';
import Vurderingsresultat from './Vurderingsresultat';

export interface AnnenInformasjon {
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
}

export interface Vurderingsversjon {
    endretAv: string;
    endretTidspunkt: string;
    versjon?: string;
    tekst: string;
    resultat: Vurderingsresultat;
    perioder: Period[];
    dokumenter: Dokument[];
}

class Vurdering {
    id: string;

    type: string;

    versjoner: Vurderingsversjon[];

    annenInformasjon: AnnenInformasjon;

    erInnleggelsesperiode: boolean;

    constructor({
        id,
        type,
        versjoner,
        annenInformasjon: { resterendeVurderingsperioder, perioderSomKanVurderes },
        erInnleggelsesperiode,
    }: Vurdering) {
        this.id = id;
        this.type = type;
        this.erInnleggelsesperiode = erInnleggelsesperiode;

        this.versjoner = versjoner.map((vurderingsversjon) => ({
            ...vurderingsversjon,
            perioder: vurderingsversjon.perioder.map(({ fom, tom }) => new Period(fom, tom)),
        }));

        this.annenInformasjon = {
            resterendeVurderingsperioder: resterendeVurderingsperioder.map(({ fom, tom }) => new Period(fom, tom)),
            perioderSomKanVurderes: perioderSomKanVurderes.map(({ fom, tom }) => new Period(fom, tom)),
        };
    }
}

export default Vurdering;
