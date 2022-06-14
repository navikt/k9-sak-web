import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { createSelector, createStructuredSelector } from 'reselect';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import VurderMilitaer from './vurderMilitaer/VurderMilitaer';
import NyoppstartetFLForm from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import FastsettBgKunYtelsePanel from './kunYtelse/FastsettBgKunYtelse';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import VurderOgFastsettATFL from './vurderOgFastsettATFL/VurderOgFastsettATFL';
import VurderEtterlonnSluttpakkeForm from './vurderOgFastsettATFL/forms/VurderEtterlonnSluttpakkeForm';
import VurderMottarYtelseForm from './vurderOgFastsettATFL/forms/VurderMottarYtelseForm';
import VurderRefusjonForm from './vurderrefusjon/VurderRefusjonForm';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';


export const getFaktaOmBeregning = createSelector(
  [ownProps => ownProps.beregningsgrunnlag],
  (beregningsgrunnlag = {}) => (beregningsgrunnlag ? beregningsgrunnlag.faktaOmBeregning : undefined),
);
export const getVurderMottarYtelse = createSelector([getFaktaOmBeregning], (faktaOmBeregning = {}) =>
  faktaOmBeregning ? faktaOmBeregning.vurderMottarYtelse : undefined,
);

export const getArbeidsgiverInfoForRefusjonskravSomKommerForSent = createSelector(
  [getFaktaOmBeregning],
  (faktaOmBeregning = {}) => {
    if (faktaOmBeregning && faktaOmBeregning.refusjonskravSomKommerForSentListe) {
      return faktaOmBeregning.refusjonskravSomKommerForSentListe;
    }
    return [];
  },
);

export const validationForVurderFakta = values => {
  if (!values) {
    return {};
  }
  const { faktaOmBeregning, beregningsgrunnlag, tilfeller, vurderMottarYtelse } = values;
  if (!faktaOmBeregning || !beregningsgrunnlag || !tilfeller) {
    return {};
  }
  return {
    ...FastsettBgKunYtelsePanel.validate(values, tilfeller),
    ...VurderMottarYtelseForm.validate(values, vurderMottarYtelse),
    ...VurderOgFastsettATFL.validate(values, tilfeller, faktaOmBeregning, beregningsgrunnlag),
  };
};

const spacer = hasShownPanel => {
  if (hasShownPanel) {
    return <VerticalSpacer twentyPx />;
  }
  return {};
};

const getFaktaPanels = (
  readOnly,
  tilfeller,
  isAvklaringsbehovClosed,
  faktaOmBeregning,
  beregningsgrunnlag,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  avklaringsbehov,
  erOverstyrer,
  fieldArrayID,
  vilkaarPeriodeFieldArrayIndex
) => {
  const faktaPanels = [];
  let hasShownPanel = false;
  tilfeller.forEach(tilfelle => {
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD) {
      hasShownPanel = true;
      faktaPanels.push(
        <React.Fragment key={tilfelle}>
          <TidsbegrensetArbeidsforholdForm
            readOnly={readOnly}
            isAvklaringsbehovClosed={isAvklaringsbehovClosed}
            faktaOmBeregning={faktaOmBeregning}
            alleKodeverk={alleKodeverk}
            fieldArrayID={fieldArrayID}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          />
        </React.Fragment>,
      );
    }
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET) {
      hasShownPanel = true;
      faktaPanels.push(
        <React.Fragment key={tilfelle}>
          {spacer(hasShownPanel)}
          <NyIArbeidslivetSNForm
            readOnly={readOnly}
            isAvklaringsbehovClosed={isAvklaringsbehovClosed}
            fieldArrayID={fieldArrayID}
          />
        </React.Fragment>,
      );
    }
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_MILITÆR_SIVILTJENESTE) {
      hasShownPanel = true;
      faktaPanels.push(
        <React.Fragment key={tilfelle}>
          <VurderMilitaer readOnly={readOnly} isAvklaringsbehovClosed={isAvklaringsbehovClosed} fieldArrayID={fieldArrayID} />
        </React.Fragment>,
      );
    }
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT) {
      hasShownPanel = true;
      faktaPanels.push(
        <React.Fragment key={tilfelle}>
          <VurderRefusjonForm
            readOnly={readOnly}
            isAvklaringsbehovClosed={isAvklaringsbehovClosed}
            faktaOmBeregning={faktaOmBeregning}
            fieldArrayID={fieldArrayID}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          />
        </React.Fragment>,
      );
    }
    if (tilfelle === faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE) {
      hasShownPanel = true;
      faktaPanels.push(
        <React.Fragment key={tilfelle}>
          <FastsettBgKunYtelsePanel
            readOnly={readOnly}
            isAvklaringsbehovClosed={isAvklaringsbehovClosed}
            faktaOmBeregning={faktaOmBeregning}
            fieldArrayID={fieldArrayID}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            alleKodeverk={alleKodeverk}
          />
        </React.Fragment>,
      );
    }
  });
  faktaPanels.push(
    <React.Fragment key="VurderOgFastsettATFL">
      {spacer(true)}
      <VurderOgFastsettATFL
        readOnly={readOnly}
        isAvklaringsbehovClosed={isAvklaringsbehovClosed}
        tilfeller={tilfeller}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        faktaOmBeregning={faktaOmBeregning}
        beregningsgrunnlag={beregningsgrunnlag}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        erOverstyrer={erOverstyrer}
        avklaringsbehov={avklaringsbehov}
        fieldArrayID={fieldArrayID}
        vilkaarPeriodeFieldArrayIndex={vilkaarPeriodeFieldArrayIndex}
      />
    </React.Fragment>,
  );
  return faktaPanels;
};

/**
 * FaktaForArbeidstakerFLOgSNPanel
 *
 * Container komponent.. Inneholder paneler for felles faktaavklaring for aksjonspunktet Vurder fakta for arbeidstaker, frilans og selvstendig næringsdrivende
 */
export const FaktaForATFLOgSNPanelImpl = ({
  readOnly,
  aktivePaneler,
  isAvklaringsbehovClosed,
  faktaOmBeregning,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  avklaringsbehov,
  erOverstyrer,
  fieldArrayID,
  vilkaarPeriodeFieldArrayIndex,
}) => (
  <div>
    {getFaktaPanels(
      readOnly,
      aktivePaneler,
      isAvklaringsbehovClosed,
      faktaOmBeregning,
      beregningsgrunnlag,
      behandlingId,
      behandlingVersjon,
      alleKodeverk,
      arbeidsgiverOpplysningerPerId,
      avklaringsbehov,
      erOverstyrer,
      fieldArrayID,
      vilkaarPeriodeFieldArrayIndex,
    ).map(panelOrSpacer => panelOrSpacer)}
  </div>
);

FaktaForATFLOgSNPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aktivePaneler: PropTypes.arrayOf(PropTypes.string).isRequired,
  faktaOmBeregning: PropTypes.shape().isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
  fieldArrayID: PropTypes.string.isRequired,
  vilkaarPeriodeFieldArrayIndex: PropTypes.number.isRequired,
};

const nyIArbeidslivetTransform = (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET);
  return {
    ...vurderFaktaValues,
    ...NyIArbeidslivetSNForm.transformValues(values),
  };
};

const kortvarigeArbeidsforholdTransform = kortvarigeArbeidsforhold => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD);
  return {
    ...vurderFaktaValues,
    ...TidsbegrensetArbeidsforholdForm.transformValues(values, kortvarigeArbeidsforhold),
  };
};

const vurderMilitaerSiviltjenesteTransform = (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_MILITÆR_SIVILTJENESTE);
  return {
    ...vurderFaktaValues,
    ...VurderMilitaer.transformValues(values),
  };
};

const vurderRefusjonskravTransform = faktaOmBeregning => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(
    faktaOmBeregningTilfelle.VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
  );
  return {
    ...vurderFaktaValues,
    ...VurderRefusjonForm.transformValues(faktaOmBeregning?.refusjonskravSomKommerForSentListe)(values),
  };
};

export const transformValues = (
  tilfeller,
  nyIArbTransform,
  kortvarigTransform,
  militaerTransform,
  vurderRefusjonTransform,
) => (vurderFaktaValues, values) => {
  if (tilfeller.length === 0) {
    return null;
  }
  let transformed = { ...vurderFaktaValues };
  tilfeller.forEach(kode => {
    if (kode === faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET) {
      transformed = nyIArbTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD) {
      transformed = kortvarigTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_MILITÆR_SIVILTJENESTE) {
      transformed = militaerTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT) {
      transformed = vurderRefusjonTransform(transformed, values);
    }
  });
  return transformed;
};

export const setInntektValues = (aktivePaneler, faktaOmBeregning, beregningsgrunnlag) => values => {
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)) {
    return { fakta: FastsettBgKunYtelsePanel.transformValues(values), overstyrteAndeler: [] };
  }
  return { ...VurderOgFastsettATFL.transformValues(faktaOmBeregning, beregningsgrunnlag)(values) };
};

const setValuesForVurderFakta = (tilfeller, values, kortvarigeArbeidsforhold, faktaOmBeregning, beregningsgrunnlag) => {
  const vurderFaktaValues = setInntektValues(tilfeller, faktaOmBeregning, beregningsgrunnlag)(values);
  return {
    fakta: transformValues(
      tilfeller,
      nyIArbeidslivetTransform,
      kortvarigeArbeidsforholdTransform(kortvarigeArbeidsforhold),
      vurderMilitaerSiviltjenesteTransform,
      vurderRefusjonskravTransform(faktaOmBeregning),
    )(vurderFaktaValues.fakta, values),
    overstyrteAndeler: vurderFaktaValues.overstyrteAndeler,
  };
};

export const transformValuesFaktaForATFLOgSN = values => {
  const { tilfeller, kortvarigeArbeidsforhold, faktaOmBeregning, beregningsgrunnlag } = values;
  return setValuesForVurderFakta(tilfeller, values, kortvarigeArbeidsforhold, faktaOmBeregning, beregningsgrunnlag);
};

const buildInitialValuesForTilfeller = (props, beregningsgrunnlag) => ({
  ...TidsbegrensetArbeidsforholdForm.buildInitialValues(props.kortvarigeArbeidsforhold),
  ...VurderMilitaer.buildInitialValues(props.faktaOmBeregning),
  ...NyIArbeidslivetSNForm.buildInitialValues(beregningsgrunnlag),
  ...NyoppstartetFLForm.buildInitialValues(beregningsgrunnlag),
  ...FastsettBgKunYtelsePanel.buildInitialValues(
    props.kunYtelse,
    props.tilfeller,
    props.faktaOmBeregning?.andelerForFaktaOmBeregning,
    props.alleKodeverk,
  ),
  ...VurderEtterlonnSluttpakkeForm.buildInitialValues(beregningsgrunnlag),
  ...VurderMottarYtelseForm.buildInitialValues(props.vurderMottarYtelse),
  ...VurderOgFastsettATFL.buildInitialValues(
    props.avklaringsbehov,
    props.faktaOmBeregning,
    props.alleKodeverk,
    props.arbeidsgiverOpplysningerPerId,
  ),
  ...VurderRefusjonForm.buildInitialValues(props.tilfeller, props.refusjonskravSomKommerForSentListe),
});

const getFaktaOmBeregningTilfellerKoder = faktaOmBeregning =>
  faktaOmBeregning && faktaOmBeregning.faktaOmBeregningTilfeller
    ? faktaOmBeregning.faktaOmBeregningTilfeller : [];

const mapStateToBuildInitialValuesProps = createStructuredSelector({
  beregningsgrunnlag: (ownProps, beregningsgrunnlag) => beregningsgrunnlag,
  kortvarigeArbeidsforhold: (ownProps, beregningsgrunnlag) =>
    beregningsgrunnlag?.faktaOmBeregning?.kortvarigeArbeidsforhold,
  kunYtelse: (ownProps, beregningsgrunnlag) => beregningsgrunnlag?.faktaOmBeregning?.kunYtelse,
  tilfeller: (ownProps, beregningsgrunnlag) => {
    const tilfeller = getFaktaOmBeregningTilfellerKoder(beregningsgrunnlag?.faktaOmBeregning);
    return tilfeller;
  },
  vurderMottarYtelse: (ownProps, beregningsgrunnlag) => beregningsgrunnlag?.faktaOmBeregning?.vurderMottarYtelse,
  alleKodeverk: ownProps => ownProps.alleKodeverk,
  avklaringsbehov: (ownProps, beregningsgrunnlag) => beregningsgrunnlag?.avklaringsbehov,
  faktaOmBeregning: (ownProps, beregningsgrunnlag) => beregningsgrunnlag?.faktaOmBeregning,
  arbeidsgiverOpplysningerPerId: ownProps => ownProps.arbeidsgiverOpplysningerPerId,
  refusjonskravSomKommerForSentListe: getArbeidsgiverInfoForRefusjonskravSomKommerForSent,
});

export const getBuildInitialValuesFaktaForATFLOgSN = createSelector(
  [mapStateToBuildInitialValuesProps, (ownProps, beregningsgrunnlag) => beregningsgrunnlag],
  (props, beregningsgrunnlag) => () => ({
    tilfeller: props.tilfeller,
    kortvarigeArbeidsforhold: props.kortvarigeArbeidsforhold,
    faktaOmBeregning: props.faktaOmBeregning,
    beregningsgrunnlag,
    vurderMottarYtelse: props.vurderMottarYtelse,
    kunYtelse: props.kunYtelse,
    ...buildInitialValuesForTilfeller(props, beregningsgrunnlag),
  }),
);

const emptyArray = [];

const mapStateToProps = (state, ownProps) => ({
  faktaOmBeregning: getFaktaOmBeregning(ownProps),
  aktivePaneler: getFaktaOmBeregningTilfellerKoder(ownProps)
    ? getFaktaOmBeregningTilfellerKoder(ownProps.beregningsgrunnlag?.faktaOmBeregning)
    : emptyArray,
});

export default connect(mapStateToProps)(FaktaForATFLOgSNPanelImpl);
