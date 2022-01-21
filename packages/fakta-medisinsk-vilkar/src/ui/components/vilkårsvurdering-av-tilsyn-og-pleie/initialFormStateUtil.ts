import { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import Vurderingstype from '../../../types/Vurderingstype';
import {
    TilsynFieldName,
    VurderingAvTilsynsbehovFormState
} from '../../../types/VurderingAvTilsynsbehovFormState';
import {
    ToOmsorgspersonerFieldName,
    VurderingAvToOmsorgspersonerFormState
} from '../../../types/VurderingAvToOmsorgspersonerFormState';

function buildInitialFormStateForEdit(
    { tekst, resultat, perioder, dokumenter }: Vurderingsversjon,
    vurderingstype: Vurderingstype
): VurderingAvTilsynsbehovFormState | VurderingAvToOmsorgspersonerFormState {
    const dokumenterFraVurdering = dokumenter.filter((dokument) => dokument.benyttet).map((dokument) => dokument.id);

    if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return {
            [TilsynFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: tekst,
            [TilsynFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: resultat === Vurderingsresultat.OPPFYLT,
            [TilsynFieldName.PERIODER]: perioder,
            [TilsynFieldName.DOKUMENTER]: dokumenterFraVurdering,
        };
    }

    if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
        return {
            [ToOmsorgspersonerFieldName.VURDERING_AV_TO_OMSORGSPERSONER]: tekst,
            [ToOmsorgspersonerFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: resultat === Vurderingsresultat.OPPFYLT,
            [ToOmsorgspersonerFieldName.PERIODER]: perioder,
            [ToOmsorgspersonerFieldName.DOKUMENTER]: dokumenterFraVurdering,
        };
    }

    return undefined;
}

export default buildInitialFormStateForEdit;
