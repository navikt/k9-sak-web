import React from 'react';
import PropTypes from 'prop-types';

import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';

import YtelserFraInfotrygd from '../tilstotendeYtelser/YtelserFraInfotrygd';
import GrunnlagForAarsinntektPanelSN from '../selvstendigNaeringsdrivende/GrunnlagForAarsinntektPanelSN';
import TilstotendeYtelser from '../tilstotendeYtelser/TilstotendeYtelser';

import MilitaerPanel from '../militær/MilitaerPanel';
import AksjonspunktBehandlerTB from '../arbeidstaker/AksjonspunktBehandlerTB';
import GrunnlagForAarsinntektPanelFL from '../frilanser/GrunnlagForAarsinntektPanelFL';
import SammenlignsgrunnlagAOrdningen from '../fellesPaneler/SammenligningsgrunnlagAOrdningen';
import GrunnlagForAarsinntektPanelAT2 from '../arbeidstaker/GrunnlagForAarsinntektPanelAT';

import NaeringsopplysningsPanel from '../selvstendigNaeringsdrivende/NaeringsOpplysningsPanel';
import beregningStyles from './beregningsgrunnlag.less';

// ------------------------------------------------------------------------------------------ //
// Variables
// ------------------------------------------------------------------------------------------ //

const {
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
} = avklaringsbehovCodes;

// ------------------------------------------------------------------------------------------ //
// Methods
// ------------------------------------------------------------------------------------------ //

const harPerioderMedAvsluttedeArbeidsforhold = allePerioder =>
  allePerioder.some(
    ({ periodeAarsaker }) =>
      periodeAarsaker && periodeAarsaker.some(({ kode }) => kode === periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET),
  );

const finnAvklaringsbehovForATFL = avklaringsbehov =>
  avklaringsbehov &&
  avklaringsbehov.find(
    ap =>
      ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS ||
      ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  );

const finnAlleAndelerIFørstePeriode = allePerioder => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};

const createRelevantePaneler = (
  alleAndelerIForstePeriode,
  relevanteStatuser,
  allePerioder,
  readOnly,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  sammenligningsGrunnlagInntekter,
  skjeringstidspunktDato,
) => (
  <div className={beregningStyles.panelLeft}>
    {relevanteStatuser.isArbeidstaker && (
      <>
        {!harPerioderMedAvsluttedeArbeidsforhold(allePerioder) && (
          <GrunnlagForAarsinntektPanelAT2
            alleAndeler={alleAndelerIForstePeriode}
            allePerioder={allePerioder}
            readOnly={readOnly}
            isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        )}
        {harPerioderMedAvsluttedeArbeidsforhold(allePerioder) && (
          <GrunnlagForAarsinntektPanelAT2
            alleAndeler={alleAndelerIForstePeriode}
            allePerioder={allePerioder}
            readOnly={readOnly}
            isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        )}
      </>
    )}
    {relevanteStatuser.isFrilanser && (
      <GrunnlagForAarsinntektPanelFL
        alleAndeler={alleAndelerIForstePeriode}
        readOnly={readOnly}
        isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
      />
    )}
    {relevanteStatuser.harDagpengerEllerAAP && (
      <div>
        <TilstotendeYtelser alleAndeler={alleAndelerIForstePeriode} relevanteStatuser={relevanteStatuser} />
      </div>
    )}
    {relevanteStatuser.isMilitaer && (
      <MilitaerPanel alleAndeler={alleAndelerIForstePeriode} />
    )}
    {relevanteStatuser.harAndreTilstotendeYtelser && (
      <YtelserFraInfotrygd bruttoPrAar={allePerioder[0].bruttoPrAar} />
    )}

    {relevanteStatuser.isSelvstendigNaeringsdrivende && (
      <>
        <GrunnlagForAarsinntektPanelSN alleAndeler={alleAndelerIForstePeriode} />
        <NaeringsopplysningsPanel alleAndelerIForstePeriode={alleAndelerIForstePeriode} />
      </>
    )}
    {!relevanteStatuser.isSelvstendigNaeringsdrivende &&
      sammenligningsGrunnlagInntekter &&
      skjeringstidspunktDato &&
      (relevanteStatuser.isFrilanser || relevanteStatuser.isArbeidstaker) && (
        <SammenlignsgrunnlagAOrdningen
          sammenligningsGrunnlagInntekter={sammenligningsGrunnlagInntekter}
          relevanteStatuser={relevanteStatuser}
          skjeringstidspunktDato={skjeringstidspunktDato}
        />
      )}
  </div>
);

// ------------------------------------------------------------------------------------------ //
// Component : BeregningsgrunnlagImpl
// ------------------------------------------------------------------------------------------ //
/**
 * Beregningsgrunnlag
 *
 * Presentasjonsskomponent. Holder på alle komponenter relatert til å vise beregningsgrunnlaget til de forskjellige
 * statusene og viser disse samlet i en faktagruppe.
 */
export const BeregningsgrunnlagImpl = ({
  readOnly,
  relevanteStatuser,
  allePerioder,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  sammenligningsGrunnlagInntekter,
  skjeringstidspunktDato,
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);
  return createRelevantePaneler(
    alleAndelerIForstePeriode,
    relevanteStatuser,
    allePerioder,
    readOnly,
    behandlingId,
    behandlingVersjon,
    alleKodeverk,
    arbeidsgiverOpplysningerPerId,
    sammenligningsGrunnlagInntekter,
    skjeringstidspunktDato,
  );
};

BeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  sammenligningsGrunnlagInntekter: PropTypes.arrayOf(PropTypes.shape()),
  skjeringstidspunktDato: PropTypes.string,
};

BeregningsgrunnlagImpl.defaultProps = {
  allePerioder: undefined,
  sammenligningsGrunnlagInntekter: undefined,
  skjeringstidspunktDato: undefined,
};

const Beregningsgrunnlag = BeregningsgrunnlagImpl;

Beregningsgrunnlag.buildInitialValues = avklaringsbehov => {
  const avklaringsbehovATFL = finnAvklaringsbehovForATFL(avklaringsbehov);
  return {
    ATFLVurdering: avklaringsbehovATFL ? avklaringsbehovATFL.begrunnelse : '',
  };
};

Beregningsgrunnlag.transformValues = (values, allePerioder) => ({
  kode: FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  begrunnelse: values.ATFLVurdering,
  fastsatteTidsbegrensedePerioder: AksjonspunktBehandlerTB.transformValues(values, allePerioder),
  frilansInntekt: values.inntektFrilanser !== undefined ? removeSpacesFromNumber(values.inntektFrilanser) : null,
});

export default Beregningsgrunnlag;
