import { Period } from '@navikt/k9-period-utils';

interface InnleggelsesperiodeVurdering {
    id: string;
    periode: Period;
    erInnleggelsesperiode: true;
}

export default InnleggelsesperiodeVurdering;
