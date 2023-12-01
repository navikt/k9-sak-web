import { Vurderingsversjon } from '../../../types/Vurdering';
import {
  FieldName as KTPFieldName,
  VurderingAvTilsynsbehovFormState,
} from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import Vurderingstype from '../../../types/Vurderingstype';
import {
  FieldName as TOFieldName,
  VurderingAvToOmsorgspersonerFormState,
} from '../vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';
import {
  FieldName as LivetsSluttfaseFieldName,
  VurderingAvLivetsSluttfaseFormState,
} from '../vurdering-av-livets-sluttfase-form/VurderingAvLivetsSluttfaseForm';
import {
  FieldName as LangvarigSykdomFieldName,
  VurderingLangvarigSykdomFormState,
} from '../vurdering-av-langvarig-sykdom-form/VurderingLangvarigSykdomForm';

function buildInitialFormStateForEdit(
  { tekst, resultat, perioder, dokumenter }: Vurderingsversjon,
  vurderingstype: Vurderingstype,
):
  | VurderingAvTilsynsbehovFormState
  | VurderingAvToOmsorgspersonerFormState
  | VurderingAvLivetsSluttfaseFormState
  | VurderingLangvarigSykdomFormState {
  const dokumenterFraVurdering = dokumenter.filter(dokument => dokument.benyttet).map(dokument => dokument.id);

  if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
    return {
      [KTPFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: tekst,
      [KTPFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: resultat === Vurderingsresultat.OPPFYLT,
      [KTPFieldName.PERIODER]: perioder,
      [KTPFieldName.DOKUMENTER]: dokumenterFraVurdering,
    };
  }
  if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
    return {
      [TOFieldName.VURDERING_AV_TO_OMSORGSPERSONER]: tekst,
      [TOFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: resultat === Vurderingsresultat.OPPFYLT,
      [TOFieldName.PERIODER]: perioder,
      [TOFieldName.DOKUMENTER]: dokumenterFraVurdering,
    };
  }
  if (vurderingstype === Vurderingstype.LIVETS_SLUTTFASE) {
    return {
      [LivetsSluttfaseFieldName.VURDERING_AV_LIVETS_SLUTTFASE]: tekst,
      [LivetsSluttfaseFieldName.ER_I_LIVETS_SLUTTFASE]: resultat,
      [LivetsSluttfaseFieldName.DOKUMENTER]: dokumenterFraVurdering,
      [LivetsSluttfaseFieldName.PERIODER]: perioder,
    };
  }
  if (vurderingstype === Vurderingstype.LANGVARIG_SYKDOM) {
    return {
      [LangvarigSykdomFieldName.VURDERING_LANGVARIG_SYKDOM]: tekst,
      [LangvarigSykdomFieldName.HAR_LANGVARIG_SYKDOM]: resultat,
      [LangvarigSykdomFieldName.DOKUMENTER]: dokumenterFraVurdering,
      [LangvarigSykdomFieldName.PERIODER]: perioder,
    };
  }
  return undefined;
}

export default buildInitialFormStateForEdit;
