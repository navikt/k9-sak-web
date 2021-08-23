import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import OAType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import 'core-js/features/array/flat-map';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import { Normaltekst } from 'nav-frontend-typografi';
import { getFormValuesForBeregning } from '../../../BeregningFormUtils';

/**
 * VurderEtterlønnSluttpakkeForm
 *
 * Presentasjonskomponent. Setter opp fakta om beregning tilfelle VURDER_ETTERLØNN_SLUTTPAKKE som ber
 * saksbehandler bestemme om en søker har inntekt fra etterlønn eller sluttpakke.
 */
export const harEtterlonnSluttpakkeField = 'vurderEtterlønnSluttpakke';

const VurderEtterlonnSluttpakkeForm = ({ readOnly, isAvklaringsbehovClosed, fieldArrayID }) => (
  <div>
    <Normaltekst>
      <FormattedMessage id="BeregningInfoPanel.EtterlønnSluttpakke.HarSøkerInntekt" />
    </Normaltekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      name={`${fieldArrayID}.${harEtterlonnSluttpakkeField}`}
      validate={[required]}
      readOnly={readOnly}
      isEdited={isAvklaringsbehovClosed}
    >
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
    </RadioGroupField>
  </div>
);

VurderEtterlonnSluttpakkeForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

VurderEtterlonnSluttpakkeForm.buildInitialValues = (beregningsgrunnlag) => {
  const initialValues = {};
  if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode) {
    return initialValues;
  }
  const relevanteAndeler = beregningsgrunnlag.beregningsgrunnlagPeriode
    .flatMap(periode => periode.beregningsgrunnlagPrStatusOgAndel)
    .filter(
      ({ arbeidsforhold }) => arbeidsforhold && arbeidsforhold.arbeidsforholdType.kode === OAType.ETTERLONN_SLUTTPAKKE,
    );
  if (relevanteAndeler.length > 0) {
    initialValues[harEtterlonnSluttpakkeField] = !!relevanteAndeler[0].beregnetPrAar && relevanteAndeler[0].beregnetPrAar > 0;
  }
  return initialValues;
};

const finnEtterlønnSluttpakkeAndel = faktaOmBeregning => {
  if (!faktaOmBeregning.andelerForFaktaOmBeregning) {
    return undefined;
  }
  const etterlønnSluttpakkeAndel = faktaOmBeregning.andelerForFaktaOmBeregning.find(
    andel =>
      andel.arbeidsforhold &&
      andel.arbeidsforhold.arbeidsforholdType &&
      andel.arbeidsforhold.arbeidsforholdType.kode === OAType.ETTERLONN_SLUTTPAKKE,
  );

  return etterlønnSluttpakkeAndel ? etterlønnSluttpakkeAndel.andelsnr : undefined;
};

VurderEtterlonnSluttpakkeForm.transformValues = (values, inntektPrMnd, faktaOmBeregning, fastsatteAndelsnr) => {
  const tilfeller = faktaOmBeregning.faktaOmBeregningTilfeller ? faktaOmBeregning.faktaOmBeregningTilfeller : [];
  if (!tilfeller.map(({ kode }) => kode).includes(faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE)) {
    return {};
  }
  if (!inntektPrMnd || inntektPrMnd.length === 0) {
    return {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE],
      vurderEtterlønnSluttpakke: { erEtterlønnSluttpakke: values[harEtterlonnSluttpakkeField] },
    };
  }
  const etterlønnSluttpakkeAndelsnr = finnEtterlønnSluttpakkeAndel(faktaOmBeregning);
  if (!etterlønnSluttpakkeAndelsnr) {
    return {};
  }
  const etterlonnSluttpakkeField = inntektPrMnd.find(field => field.andelsnr === etterlønnSluttpakkeAndelsnr);
  if (!etterlonnSluttpakkeField) {
    return {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE],
      vurderEtterlønnSluttpakke: { erEtterlønnSluttpakke: values[harEtterlonnSluttpakkeField] },
    };
  }
  if (fastsatteAndelsnr.includes(etterlonnSluttpakkeField.andelsnr)) {
    return {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE],
      vurderEtterlønnSluttpakke: { erEtterlønnSluttpakke: values[harEtterlonnSluttpakkeField] },
    };
  }
  fastsatteAndelsnr.push(etterlonnSluttpakkeField.andelsnr);
  const inntekt = {
    fastsettEtterlønnSluttpakke: { fastsattPrMnd: etterlonnSluttpakkeField.fastsattBelop },
  };
  return {
    faktaOmBeregningTilfeller: [
      faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE,
      faktaOmBeregningTilfelle.FASTSETT_ETTERLONN_SLUTTPAKKE,
    ],
    ...inntekt,
    vurderEtterlønnSluttpakke: { erEtterlønnSluttpakke: values[harEtterlonnSluttpakkeField] },
  };
};

const mapStateToProps = (state, ownProps) => ({
  harEtterlonnSluttpakke: getFormValuesForBeregning(state, ownProps)[harEtterlonnSluttpakkeField],
});

export default connect(mapStateToProps)(VurderEtterlonnSluttpakkeForm);
