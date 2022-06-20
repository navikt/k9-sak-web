import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes, FieldArray } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { behandlingForm } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import avklaringsbehovCodes, { harAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { FaktaBegrunnelseTextField, FaktaSubmitButton } from '@k9-sak-web/fakta-felles';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';

import VurderRefusjonFieldArrayComponent from './VurderRefusjonFieldArrayComponent';

const BEGRUNNELSE_FIELD = 'VURDER_REFUSJON_BERGRUNN_BEGRUNNELSE';
const FORM_NAME = 'VURDER_REFUSJON_BERGRUNN_FORM';

const fieldArrayName = 'vurderEndringRefusjonListe';

const { VURDER_REFUSJON_BERGRUNN } = avklaringsbehovCodes;

const findAvklaringsbehovMedBegrunnelse = avklaringsbehov =>
  avklaringsbehov.find(ab => ab.definisjon === VURDER_REFUSJON_BERGRUNN && ab.begrunnelse !== null);

/**
 * VurderEndringRefusjonForm
 *
 * Container komponent. Har ansvar for å sette opp Redux Formen for "vurder endring i refusjon" panel.
 * 
 * Formen består av et fieldArray som mounter fields per beregningsgrunnlag ved flere vilkårsperioder
 * 
 */
const VurderEndringRefusjonFormImpl = ({
  readOnly,
  submittable,
  hasBegrunnelse,
  submitEnabled,
  behandlingId,
  behandlingVersjon,
  alleBeregningsgrunnlag,
  arbeidsgiverOpplysningerPerId,
  avklaringsbehov,
  aktivtBeregningsgrunnlagIndex,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FieldArray
      name={fieldArrayName}
      component={VurderRefusjonFieldArrayComponent}
      readOnly={readOnly}
      alleBeregningsgrunnlag={alleBeregningsgrunnlag}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndex}
    />
    <VerticalSpacer twentyPx />
    <FaktaBegrunnelseTextField
      name={BEGRUNNELSE_FIELD}
      isSubmittable={submittable}
      isReadOnly={readOnly}
      hasBegrunnelse={hasBegrunnelse}
    />
    <VerticalSpacer twentyPx />
    <FaktaSubmitButton
      formName={formProps.form}
      isSubmittable={submittable && submitEnabled}
      isReadOnly={readOnly}
      hasOpenAksjonspunkter={!isAvklaringsbehovOpen(avklaringsbehov)}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    />
  </form>
);

VurderEndringRefusjonFormImpl.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  submitEnabled: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleBeregningsgrunnlag: PropTypes.arrayOf(beregningsgrunnlagPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  aktivtBeregningsgrunnlagIndex: PropTypes.number.isRequired,
  ...formPropTypes,
};



export const transformValues = createSelector(
  [
    ownProps => ownProps.alleBeregningsgrunnlag,
    ownProps => ownProps.avklaringsbehov,
    ownProps => ownProps.vilkårsperioder,
  ],
  (alleBeregningsgrunnlag, avklaringsbehov, vilkårsperioder) => values => {
    if (harAvklaringsbehov(VURDER_REFUSJON_BERGRUNN, avklaringsbehov)) {
      const fieldArrayList = values[fieldArrayName];
      const begrunnelse = values[BEGRUNNELSE_FIELD];
      return [
        {
          begrunnelse,
          kode: VURDER_REFUSJON_BERGRUNN,
          grunnlag: VurderRefusjonFieldArrayComponent.transformValues(fieldArrayList, alleBeregningsgrunnlag, vilkårsperioder),
        },
      ];
    }
    return {};
  },
);

export const buildInitialValues = createSelector(
  [
    ownProps => ownProps.alleBeregningsgrunnlag,
    ownProps => ownProps.avklaringsbehov,
  ],
  (alleBeregningsgrunnlag, avklaringsbehov) => {
    if (!harAvklaringsbehov(VURDER_REFUSJON_BERGRUNN, avklaringsbehov)) {
      return {};
    }
    return {
      ...FaktaBegrunnelseTextField.buildInitialValues(
        findAvklaringsbehovMedBegrunnelse(avklaringsbehov),
        BEGRUNNELSE_FIELD,
      ),
      [fieldArrayName]: VurderRefusjonFieldArrayComponent.buildInitialValues(alleBeregningsgrunnlag)
    };
  },
);


const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback(transformValues(initialOwnProps)(values));
  return (state, ownProps) => {
    const initialValues = buildInitialValues(ownProps);
    const hasBegrunnelse = initialValues && !!initialValues[BEGRUNNELSE_FIELD];
    return {
      hasBegrunnelse,
      initialValues,
      onSubmit,
    };
  };
};

const VurderEndringRefusjonForm = connect(mapStateToPropsFactory)(
  behandlingForm({ form: FORM_NAME })(VurderEndringRefusjonFormImpl),
);


export default VurderEndringRefusjonForm;
