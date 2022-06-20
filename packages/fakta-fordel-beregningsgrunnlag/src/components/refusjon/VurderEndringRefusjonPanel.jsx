import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';

import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';
import TidligereUtbetalinger from './TidligereUtbetalinger';
import VurderEndringRefusjonRad from './VurderEndringRefusjonRad';


const BEGRUNNELSE_FIELD = 'VURDER_REFUSJON_BERGRUNN_BEGRUNNELSE';
const FORM_NAME = 'VURDER_REFUSJON_BERGRUNN_FORM';

const {
  VURDER_REFUSJON_BERGRUNN,
} = aksjonspunktCodes;

const finnAksjonspunkt = (avklaringsbehov) => (avklaringsbehov
  ? avklaringsbehov.find((ap) => ap.definisjon === VURDER_REFUSJON_BERGRUNN) : undefined);

const lagRadNøkkel = (andel) => {
  if (andel.arbeidsgiver.arbeidsgiverAktørId) {
    return `${andel.arbeidsgiver.arbeidsgiverAktørId}${andel.internArbeidsforholdRef})`;
  }
  return `${andel.arbeidsgiver.arbeidsgiverOrgnr}${andel.internArbeidsforholdRef})`;
};
export const VurderEndringRefusjonPanelImpl = ({
  readOnly,
  beregningsgrunnlag,
  avklaringsbehov,
  arbeidsgiverOpplysningerPerId,
  fieldId,
  ...formProps
}) => {
  const { andeler } = beregningsgrunnlag.refusjonTilVurdering;
  const ap = finnAksjonspunkt(avklaringsbehov);
  const erAksjonspunktÅpent = ap ? isAvklaringsbehovOpen(ap.status) : false;
  return (
    <>
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={erAksjonspunktÅpent}>
        {[<FormattedMessage id="BeregningInfoPanel.RefusjonBG.Aksjonspunkt" key="aksjonspunktText" />]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer sixteenPx />
      <form onSubmit={formProps.handleSubmit}>
        <Undertittel><FormattedMessage id="BeregningInfoPanel.RefusjonBG.Tittel" /></Undertittel>
        <VerticalSpacer sixteenPx />
        <TidligereUtbetalinger beregningsgrunnlag={beregningsgrunnlag} arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId} />
        {andeler.map((andel) => (
          <VurderEndringRefusjonRad
            fieldId={fieldId}
            refusjonAndel={andel}
            readOnly={readOnly}
            erAksjonspunktÅpent={erAksjonspunktÅpent}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            key={lagRadNøkkel(andel)}
            skjæringstidspunkt={beregningsgrunnlag.skjaeringstidspunktBeregning}
            formName={FORM_NAME}
          />
        ))}
        <VerticalSpacer sixteenPx />
      </form>
    </>
  );
};

VurderEndringRefusjonPanelImpl.propTypes = {
  fieldId: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  aktivtBeregningsgrunnlagIndex: PropTypes.number.isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired
};

export const buildInitialValues = (bg, avklaringsbehov) => {
  const { andeler } = bg.refusjonTilVurdering;
  let initialValues = {};
  andeler.forEach((andel) => {
    initialValues = {
      ...initialValues,
      ...VurderEndringRefusjonRad.buildInitialValues(andel),
    };
  });
  const refusjonAP = finnAksjonspunkt(avklaringsbehov);
  initialValues[BEGRUNNELSE_FIELD] = refusjonAP && refusjonAP.begrunnelse ? refusjonAP.begrunnelse : '';
  return initialValues;
};

export const transformValues = (values, bg) => {
  const { andeler } = bg.refusjonTilVurdering;
  const transformedAndeler = andeler.map((andel) => VurderEndringRefusjonRad.transformValues(values, andel, bg.skjaeringstidspunktBeregning));
  return {
    fastsatteAndeler: transformedAndeler,
  };
};



export default VurderEndringRefusjonPanelImpl;
