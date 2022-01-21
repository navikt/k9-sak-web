import { Period } from '@navikt/k9-period-utils';
// import {
//     FieldName as ToOmsorgspersonerFieldName,
//     VurderingAvToOmsorgspersonerFormState,
// } from '../ui/components/vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';
import Vurderingsresultat from '../types/Vurderingsresultat';
import Dokument from '../types/Dokument';
import { Vurderingsversjon } from '../types/Vurdering';
import { finnBenyttedeDokumenter } from './dokumentUtils';
import {
    ToOmsorgspersonerFieldName,
    VurderingAvToOmsorgspersonerFormState
} from '../types/VurderingAvToOmsorgspersonerFormState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export enum TilsynFieldName {
    VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE = 'vurderingAvKontinuerligTilsynOgPleie',
    HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE = 'harBehovForKontinuerligTilsynOgPleie',
    PERIODER = 'perioder',
    DOKUMENTER = 'dokumenter',
}

export interface VurderingAvTilsynsbehovFormState {
    [TilsynFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]?: string;
    [TilsynFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]?: boolean;
    [TilsynFieldName.PERIODER]?: Period[];
    [TilsynFieldName.DOKUMENTER]: string[];
}

export const lagTilsynsbehovVurdering = (
    formState: VurderingAvTilsynsbehovFormState,
    alleDokumenter: Dokument[]
): Partial<Vurderingsversjon> => {
    const resultat = formState[TilsynFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]
        ? Vurderingsresultat.OPPFYLT
        : Vurderingsresultat.IKKE_OPPFYLT;

    const perioder = formState[TilsynFieldName.PERIODER].map(
        (periodeWrapper) => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom)
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
    alleDokumenter: Dokument[]
): Partial<Vurderingsversjon> => {
    const resultat = formState[ToOmsorgspersonerFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]
        ? Vurderingsresultat.OPPFYLT
        : Vurderingsresultat.IKKE_OPPFYLT;
    const perioder = formState[TilsynFieldName.PERIODER].map(
        (periodeWrapper) => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom)
    );
    const begrunnelse = formState[ToOmsorgspersonerFieldName.VURDERING_AV_TO_OMSORGSPERSONER];

    return {
        resultat,
        perioder,
        tekst: begrunnelse,
        dokumenter: finnBenyttedeDokumenter(formState[TilsynFieldName.DOKUMENTER], alleDokumenter),
    };
};
