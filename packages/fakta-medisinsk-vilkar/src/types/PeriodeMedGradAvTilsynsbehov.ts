import { Period } from '@navikt/k9-period-utils';
import GradAvTilsynsbehov from './GradAvTilsynsbehov';

interface PeriodeMedGradAvTilsynsbehov {
    periode: Period;
    grad: GradAvTilsynsbehov;
}

export default PeriodeMedGradAvTilsynsbehov;
