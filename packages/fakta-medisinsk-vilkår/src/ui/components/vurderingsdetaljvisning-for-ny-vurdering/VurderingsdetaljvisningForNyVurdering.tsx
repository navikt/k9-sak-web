import { addYearsToDate, Period } from '@fpsak-frontend/utils';
import { k9_sak_kontrakt_sykdom_SykdomVurderingType } from '@navikt/k9-sak-typescript-client/types';
import React, { type JSX } from 'react';
import LinkRel from '../../../constants/LinkRel';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { findLinkByRel } from '../../../util/linkUtils';
import { finnMaksavgrensningerForPerioder } from '../../../util/periodUtils';
import ContainerContext from '../../context/ContainerContext';
import VurderingContext from '../../context/VurderingContext';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import VurderingLangvarigSykdomForm, {
  FieldName as LangvarigSykdomFieldName,
  VurderingLangvarigSykdomFormState,
} from '../vurdering-av-langvarig-sykdom-form/VurderingLangvarigSykdomForm';
import VurderingAvLivetsSluttfaseForm, {
  FieldName as LivetsSluttfaseFieldName,
  VurderingAvLivetsSluttfaseFormState,
} from '../vurdering-av-livets-sluttfase-form/VurderingAvLivetsSluttfaseForm';
import VurderingAvTilsynsbehovForm, {
  FieldName as KTPFieldName,
  VurderingAvTilsynsbehovFormState,
} from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import VurderingAvToOmsorgspersonerForm, {
  FieldName as TOFieldName,
  VurderingAvToOmsorgspersonerFormState,
} from '../vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';

interface VurderingsdetaljvisningForNyVurderingProps {
  vurderingsoversikt: Vurderingsoversikt;
  radForNyVurderingVises: boolean;
  onVurderingLagret: () => void;
  onAvbryt: () => void;
}

function makeDefaultValues(
  vurderingstype: k9_sak_kontrakt_sykdom_SykdomVurderingType,
  perioder: Period[],
):
  | VurderingAvToOmsorgspersonerFormState
  | VurderingAvTilsynsbehovFormState
  | VurderingAvLivetsSluttfaseFormState
  | VurderingLangvarigSykdomFormState {
  if (vurderingstype === k9_sak_kontrakt_sykdom_SykdomVurderingType.KONTINUERLIG_TILSYN_OG_PLEIE) {
    return {
      [KTPFieldName.MANGLER_LEGEERKLÆRING]: false,
      [KTPFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
      [KTPFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
      [KTPFieldName.PERIODER]: perioder,
      [KTPFieldName.DOKUMENTER]: [],
    };
  }
  if (vurderingstype === k9_sak_kontrakt_sykdom_SykdomVurderingType.TO_OMSORGSPERSONER) {
    return {
      [TOFieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
      [TOFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
      [TOFieldName.PERIODER]: perioder,
      [TOFieldName.DOKUMENTER]: [],
    };
  }

  if (vurderingstype === k9_sak_kontrakt_sykdom_SykdomVurderingType.LIVETS_SLUTTFASE) {
    return {
      [LivetsSluttfaseFieldName.VURDERING_AV_LIVETS_SLUTTFASE]: '',
      [LivetsSluttfaseFieldName.ER_I_LIVETS_SLUTTFASE]: undefined,
      [LivetsSluttfaseFieldName.SPLITT_PERIODE_DATO]: finnMaksavgrensningerForPerioder(perioder).fom,
      [LivetsSluttfaseFieldName.DOKUMENTER]: [],
      [LivetsSluttfaseFieldName.PERIODER]: perioder,
    };
  }

  // Fallback / Vurderingstype.LANGVARIG_SYKDOM)
  return {
    [LangvarigSykdomFieldName.VURDERING_LANGVARIG_SYKDOM]: '',
    [LangvarigSykdomFieldName.HAR_LANGVARIG_SYKDOM]: undefined,
    [LangvarigSykdomFieldName.SPLITT_PERIODE_DATO]: finnMaksavgrensningerForPerioder(perioder).fom,
    [LangvarigSykdomFieldName.DOKUMENTER]: [],
    [LangvarigSykdomFieldName.PERIODER]: perioder,
  };
}

const VurderingsdetaljvisningForNyVurdering = ({
  vurderingsoversikt,
  onVurderingLagret,
  onAvbryt,
  radForNyVurderingVises,
}: VurderingsdetaljvisningForNyVurderingProps): JSX.Element => {
  const { readOnly } = React.useContext(ContainerContext);
  const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
  const resterendeVurderingsperioderDefaultValue = vurderingsoversikt.resterendeVurderingsperioder;

  const defaultPerioder = () => {
    if (resterendeVurderingsperioderDefaultValue?.length > 0) {
      return resterendeVurderingsperioderDefaultValue;
    }

    const skalViseValgfriePerioder = !readOnly && vurderingsoversikt?.resterendeValgfrieVurderingsperioder.length > 0;
    if (skalViseValgfriePerioder) {
      return vurderingsoversikt.resterendeValgfrieVurderingsperioder || [new Period('', '')];
    }

    return [new Period('', '')];
  };

  const { endpoints } = React.useContext(ContainerContext);
  const { vurderingstype } = React.useContext(VurderingContext);
  return (
    <NyVurderingController
      opprettVurderingLink={opprettLink}
      dataTilVurderingUrl={endpoints.dataTilVurdering}
      onVurderingLagret={onVurderingLagret}
      formRenderer={(dokumenter, onSubmit, isSubmitting) => {
        if (k9_sak_kontrakt_sykdom_SykdomVurderingType.KONTINUERLIG_TILSYN_OG_PLEIE === vurderingstype) {
          return (
            <VurderingAvTilsynsbehovForm
              defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
              resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
              perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
              dokumenter={dokumenter}
              onSubmit={onSubmit}
              onAvbryt={radForNyVurderingVises ? onAvbryt : () => {}}
              isSubmitting={isSubmitting}
              harPerioderDerPleietrengendeErOver18år={vurderingsoversikt.harPerioderDerPleietrengendeErOver18år}
              barnetsAttenårsdag={
                vurderingsoversikt.harPerioderDerPleietrengendeErOver18år
                  ? (addYearsToDate(vurderingsoversikt.pleietrengendesFødselsdato, 18) ?? '')
                  : ''
              }
            />
          );
        }
        if (k9_sak_kontrakt_sykdom_SykdomVurderingType.TO_OMSORGSPERSONER === vurderingstype) {
          return (
            <VurderingAvToOmsorgspersonerForm
              defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
              resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
              perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
              dokumenter={dokumenter}
              onSubmit={onSubmit}
              onAvbryt={radForNyVurderingVises ? onAvbryt : () => {}}
              isSubmitting={isSubmitting}
            />
          );
        }
        if (k9_sak_kontrakt_sykdom_SykdomVurderingType.LIVETS_SLUTTFASE === vurderingstype) {
          return (
            <VurderingAvLivetsSluttfaseForm
              defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
              resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
              perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
              dokumenter={dokumenter}
              onSubmit={onSubmit}
              onAvbryt={radForNyVurderingVises ? onAvbryt : () => {}}
              isSubmitting={isSubmitting}
            />
          );
        }
        if (k9_sak_kontrakt_sykdom_SykdomVurderingType.LANGVARIG_SYKDOM === vurderingstype) {
          return (
            <VurderingLangvarigSykdomForm
              defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
              resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
              perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
              dokumenter={dokumenter}
              onSubmit={onSubmit}
              onAvbryt={radForNyVurderingVises ? onAvbryt : () => {}}
              isSubmitting={isSubmitting}
            />
          );
        }
        return null;
      }}
    />
  );
};

export default VurderingsdetaljvisningForNyVurdering;
