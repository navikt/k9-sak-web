import { Period } from '@navikt/k9-period-utils';
import Vurderingsresultat from './Vurderingsresultat';
import Link from './Link';

interface ManuellVurdering {
    id: string;
    resultat: Vurderingsresultat;
    periode: Period;
    gjelderForSøker: boolean;
    gjelderForAnnenPart: boolean;
    links: Link[];
    endretIDenneBehandlingen: boolean;
    erInnleggelsesperiode: boolean;
}

export default ManuellVurdering;
