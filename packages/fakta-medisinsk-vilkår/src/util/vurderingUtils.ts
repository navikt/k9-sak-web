import { Period } from '@fpsak-frontend/utils';
import {
  FieldName as TilsynFieldName,
  VurderingAvTilsynsbehovFormState,
} from '../ui/components/vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import {
  FieldName as ToOmsorgspersonerFieldName,
  VurderingAvToOmsorgspersonerFormState,
} from '../ui/components/vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';
import {
  FieldName as LivetsSluttfaseFieldName,
  VurderingAvLivetsSluttfaseFormState,
} from '../ui/components/vurdering-av-livets-sluttfase-form/VurderingAvLivetsSluttfaseForm';
import Vurderingsresultat from '../types/Vurderingsresultat';
import Dokument from '../types/Dokument';
import { Vurderingsversjon } from '../types/Vurdering';
import { finnBenyttedeDokumenter } from './dokumentUtils';
import {
  FieldName as LangvarigSykdomFieldName,
  VurderingLangvarigSykdomFormState,
} from '../ui/components/vurdering-av-langvarig-sykdom-form/VurderingLangvarigSykdomForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export const lagTilsynsbehovVurdering = (
  formState: VurderingAvTilsynsbehovFormState,
  alleDokumenter: Dokument[],
): Partial<Vurderingsversjon> => {
  const resultat = formState[TilsynFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]
    ? Vurderingsresultat.OPPFYLT
    : Vurderingsresultat.IKKE_OPPFYLT;

  const perioder = formState[TilsynFieldName.PERIODER].map(
    periodeWrapper => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom),
  );
  const begrunnelse = formState[TilsynFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE];

  return {
    resultat,
    perioder,
    tekst: begrunnelse,
    dokumenter: finnBenyttedeDokumenter(formState[TilsynFieldName.DOKUMENTER], alleDokumenter),
  };
};

export const lagToOmsorgspersonerVurdering = (
  formState: VurderingAvToOmsorgspersonerFormState,
  alleDokumenter: Dokument[],
): Partial<Vurderingsversjon> => {
  const resultat = formState[ToOmsorgspersonerFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]
    ? Vurderingsresultat.OPPFYLT
    : Vurderingsresultat.IKKE_OPPFYLT;
  const perioder = formState[TilsynFieldName.PERIODER].map(
    periodeWrapper => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom),
  );
  const begrunnelse = formState[ToOmsorgspersonerFieldName.VURDERING_AV_TO_OMSORGSPERSONER];

  return {
    resultat,
    perioder,
    tekst: begrunnelse,
    dokumenter: finnBenyttedeDokumenter(formState[TilsynFieldName.DOKUMENTER], alleDokumenter),
  };
};

export const lagSluttfaseVurdering = (
  formState: VurderingAvLivetsSluttfaseFormState,
  alleDokumenter: Dokument[],
): Partial<Vurderingsversjon> => {
  const resultat = formState[LivetsSluttfaseFieldName.ER_I_LIVETS_SLUTTFASE];
  const tekst = formState[LivetsSluttfaseFieldName.VURDERING_AV_LIVETS_SLUTTFASE];
  const dokumenter = finnBenyttedeDokumenter(formState[LivetsSluttfaseFieldName.DOKUMENTER], alleDokumenter);
  const perioder = formState[LivetsSluttfaseFieldName.PERIODER].map(
    periodeWrapper => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom),
  );

  return {
    resultat,
    tekst,
    perioder,
    dokumenter,
  };
};

export const lagLangvarigSykdomVurdering = (
  formState: VurderingLangvarigSykdomFormState,
  alleDokumenter: Dokument[],
): Partial<Vurderingsversjon> => {
  const resultat = formState[LangvarigSykdomFieldName.HAR_LANGVARIG_SYKDOM];
  const tekst = formState[LangvarigSykdomFieldName.VURDERING_LANGVARIG_SYKDOM];
  const dokumenter = finnBenyttedeDokumenter(formState[LangvarigSykdomFieldName.DOKUMENTER], alleDokumenter);
  const perioder = formState[LangvarigSykdomFieldName.PERIODER].map(
    periodeWrapper => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom),
  );

  return {
    resultat,
    tekst,
    perioder,
    dokumenter,
  };
};
