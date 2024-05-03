import { addYearsToDate, Period } from '@k9-sak-web/utils';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Vurderingstype from '../../../types/Vurderingstype';
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
  vurderingstype: Vurderingstype,
  perioder: Period[],
):
  | VurderingAvToOmsorgspersonerFormState
  | VurderingAvTilsynsbehovFormState
  | VurderingAvLivetsSluttfaseFormState
  | VurderingLangvarigSykdomFormState {
  if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
    return {
      [KTPFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
      [KTPFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
      [KTPFieldName.PERIODER]: perioder,
      [KTPFieldName.DOKUMENTER]: [],
    };
  }
  if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
    return {
      [TOFieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
      [TOFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
      [TOFieldName.PERIODER]: perioder,
      [TOFieldName.DOKUMENTER]: [],
    };
  }

  if (vurderingstype === Vurderingstype.LIVETS_SLUTTFASE) {
    return {
      [LivetsSluttfaseFieldName.VURDERING_AV_LIVETS_SLUTTFASE]: '',
      [LivetsSluttfaseFieldName.ER_I_LIVETS_SLUTTFASE]: undefined,
      [LivetsSluttfaseFieldName.SPLITT_PERIODE_DATO]: finnMaksavgrensningerForPerioder(perioder).fom,
      [LivetsSluttfaseFieldName.DOKUMENTER]: [],
      [LivetsSluttfaseFieldName.PERIODER]: perioder,
    };
  }

  if (vurderingstype === Vurderingstype.LANGVARIG_SYKDOM) {
    return {
      [LangvarigSykdomFieldName.VURDERING_LANGVARIG_SYKDOM]: '',
      [LangvarigSykdomFieldName.HAR_LANGVARIG_SYKDOM]: undefined,
      [LangvarigSykdomFieldName.SPLITT_PERIODE_DATO]: finnMaksavgrensningerForPerioder(perioder).fom,
      [LangvarigSykdomFieldName.DOKUMENTER]: [],
      [LangvarigSykdomFieldName.PERIODER]: perioder,
    };
  }

  return null;
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
        if (Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE === vurderingstype) {
          return (
            <VurderingAvTilsynsbehovForm
              defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
              resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
              perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
              dokumenter={dokumenter}
              onSubmit={onSubmit}
              onAvbryt={radForNyVurderingVises ? () => onAvbryt() : undefined}
              isSubmitting={isSubmitting}
              harPerioderDerPleietrengendeErOver18år={vurderingsoversikt.harPerioderDerPleietrengendeErOver18år}
              barnetsAttenårsdag={
                vurderingsoversikt.harPerioderDerPleietrengendeErOver18år
                  ? addYearsToDate(vurderingsoversikt.pleietrengendesFødselsdato, 18)
                  : undefined
              }
            />
          );
        }
        if (Vurderingstype.TO_OMSORGSPERSONER === vurderingstype) {
          return (
            <VurderingAvToOmsorgspersonerForm
              defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
              resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
              perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
              dokumenter={dokumenter}
              onSubmit={onSubmit}
              onAvbryt={radForNyVurderingVises ? () => onAvbryt() : undefined}
              isSubmitting={isSubmitting}
            />
          );
        }
        if (Vurderingstype.LIVETS_SLUTTFASE === vurderingstype) {
          return (
            <VurderingAvLivetsSluttfaseForm
              defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
              resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
              perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
              dokumenter={dokumenter}
              onSubmit={onSubmit}
              onAvbryt={radForNyVurderingVises ? () => onAvbryt() : undefined}
              isSubmitting={isSubmitting}
            />
          );
        }
        if (Vurderingstype.LANGVARIG_SYKDOM === vurderingstype) {
          return (
            <VurderingLangvarigSykdomForm
              defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
              resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
              perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
              dokumenter={dokumenter}
              onSubmit={onSubmit}
              onAvbryt={radForNyVurderingVises ? () => onAvbryt() : undefined}
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
