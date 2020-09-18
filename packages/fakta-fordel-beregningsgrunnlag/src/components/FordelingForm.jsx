import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes, FieldArray } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { FaktaSubmitButton, FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-felles';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { behandlingForm } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FordelBeregningsgrunnlagForm from './fordeling/FordelBeregningsgrunnlagForm';
import FordelingHelpText from './FordelingHelpText';
import fordelBeregningsgrunnlagAksjonspunkterPropType from '../propTypes/fordelBeregningsgrunnlagAksjonspunkterPropType';

const { FORDEL_BEREGNINGSGRUNNLAG } = aksjonspunktCodes;

const FORM_NAME_FORDEL_BEREGNING = 'fordelBeregningsgrunnlagForm';

const findAksjonspunktMedBegrunnelse = aksjonspunkter =>
  aksjonspunkter.find(ap => ap.definisjon.kode === FORDEL_BEREGNINGSGRUNNLAG && ap.begrunnelse !== null);

export const BEGRUNNELSE_FORDELING_NAME = 'begrunnelseFordeling';

const fieldArrayName = 'fordelingListe';


const renderFordeling = ({
  fields,
  readOnly,
  submittable,
  isAksjonspunktClosed,
  hasBegrunnelse,
  submitEnabled,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  alleKodeverk,
  behandlingType,
  aksjonspunkter,
  kreverManuellBehandling,
  aktivtBeregningsgrunnlagIndex,
  formProps
}) => (
  fields.map(
    (field, index) =>
      index === aktivtBeregningsgrunnlagIndex && (
        <div key={field}>
          {kreverManuellBehandling &&
    <>
    <FordelingHelpText
      isAksjonspunktClosed={isAksjonspunktClosed}
      alleKodeverk={alleKodeverk}
      aksjonspunkter={aksjonspunkter}
      beregningsgrunnlag={beregningsgrunnlag}
    />
    <VerticalSpacer twentyPx />
    </>
  }
  <FordelBeregningsgrunnlagForm
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
    beregningsgrunnlag={beregningsgrunnlag}
    alleKodeverk={alleKodeverk}
    behandlingType={behandlingType}
    grunnlagFieldId={field}
  />
  <VerticalSpacer twentyPx />
  {kreverManuellBehandling &&
    <>
      <FaktaBegrunnelseTextField
        name={BEGRUNNELSE_FORDELING_NAME}
        isDirty={formProps.dirty}
        isSubmittable={submittable}
        isReadOnly={readOnly}
        hasBegrunnelse={hasBegrunnelse}
      />
      <VerticalSpacer twentyPx />
      <FaktaSubmitButton
        formName={formProps.form}
        isSubmittable={submittable && submitEnabled}
        isReadOnly={readOnly}
        hasOpenAksjonspunkter={!isAksjonspunktClosed}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
    </>
  }
  </div>
      )

  )
);


/**
 * FordelingForm
 *
 * Container komponent. Har ansvar for å sette opp Redux Formen for "avklar fakta om fordeling" panel.
 */
const FordelingFormImpl = ({
  readOnly,
  submittable,
  isAksjonspunktClosed,
  hasBegrunnelse,
  submitEnabled,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  alleKodeverk,
  behandlingType,
  aksjonspunkter,
  kreverManuellBehandling,
  aktivtBeregningsgrunnlagIndex,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
      <FieldArray 
        name={fieldArrayName} 
        component={renderFordeling}
        submitEnabled={submitEnabled}
        submittable={submittable}
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        alleKodeverk={alleKodeverk}
        beregningsgrunnlag={beregningsgrunnlag}
        behandlingType={behandlingType}
        aksjonspunkter={aksjonspunkter}
        kreverManuellBehandling={kreverManuellBehandling}
        aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndex}
        hasBegrunnelse={hasBegrunnelse}
        isAksjonspunktClosed={isAksjonspunktClosed}
        formProps={formProps}
      />
  </form>
);

FordelingFormImpl.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  submitEnabled: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(fordelBeregningsgrunnlagAksjonspunkterPropType).isRequired,
  kreverManuellBehandling: PropTypes.bool.isRequired,
  aktivtBeregningsgrunnlagIndex: PropTypes.number.isRequired,
  ...formPropTypes,
};

const kreverManuellBehandling = (bg) => {
  const fordeling = bg.faktaOmFordeling;
  if (fordeling){
    const fordelBg = fordeling.fordelBeregningsgrunnlag;
    if (fordelBg) {
      return fordelBg.fordelBeregningsgrunnlagPerioder.some(p => p.skalRedigereInntekt || p.skalKunneEndreRefusjon);
    }
  }
  return false;
}


const mapGrunnlagsliste = (fieldArrayList, alleBeregningsgrunnlag, vilkårsperioder) => {
  return fieldArrayList
  .filter((currentFormValues, index) => kreverManuellBehandling(alleBeregningsgrunnlag[index]))
  .map((currentFormValues, index) => {
    const bg = alleBeregningsgrunnlag[index];
    const stpOpptjening = bg.faktaOmBeregning.avklarAktiviteter.skjæringstidspunkt;
    const vilkarPeriode = vilkårsperioder.find(periode => periode.periode.fom === stpOpptjening);
    return {
        periode: vilkarPeriode.periode,
        ...FordelBeregningsgrunnlagForm.transformValues(currentFormValues, bg),
    };
  });
}

export const transformValuesFordelBeregning = createSelector(
  [ownProps => ownProps.alleBeregningsgrunnlag, 
    ownProps => ownProps.aksjonspunkter,
    ownProps => ownProps.vilkårsperioder
  ],
  (alleBeregningsgrunnlag, aksjonspunkter, vilkårsperioder) => values => {
    if (hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      const fieldArrayList = values[fieldArrayName];
      const faktaBeregningValues = values;
      const begrunnelse = faktaBeregningValues[BEGRUNNELSE_FORDELING_NAME];
      return [
        {
          begrunnelse,
          kode: FORDEL_BEREGNINGSGRUNNLAG,
          grunnlag: mapGrunnlagsliste(fieldArrayList, alleBeregningsgrunnlag, vilkårsperioder),
        },
      ];
    }
    return {};
  },
);

export const buildInitialValuesFordelBeregning = createSelector(
  [ownProps => ownProps.alleBeregningsgrunnlag, 
    ownProps => ownProps.alleKodeverk,
    ownProps => ownProps.aksjonspunkter],
  (alleBeregningsgrunnlag, alleKodeverk, aksjonspunkter) => {

    if (!hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      return {};
    }
    return {
      ...FaktaBegrunnelseTextField.buildInitialValues(
        findAksjonspunktMedBegrunnelse(aksjonspunkter),
        BEGRUNNELSE_FORDELING_NAME,
      ),
      [fieldArrayName]: alleBeregningsgrunnlag.map((bg) => FordelBeregningsgrunnlagForm.buildInitialValues(
        bg,
        getKodeverknavnFn(alleKodeverk, kodeverkTyper)))
      } 
    }
);

export const getValidationFordelBeregning = createSelector(
  [ownProps => ownProps.beregningsgrunnlag, ownProps => ownProps.alleKodeverk, ownProps => ownProps.aksjonspunkter],
  (beregningsgrunnlag, alleKodeverk, aksjonspunkter) => values => {
    if (hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      return {
        ...FordelBeregningsgrunnlagForm.validate(
          values,
          beregningsgrunnlag,
          getKodeverknavnFn(alleKodeverk, kodeverkTyper),
        ),
      };
    }
    return null;
  },
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback(transformValuesFordelBeregning(initialOwnProps)(values));
  return (state, ownProps) => {
    const relevantAp = ownProps.aksjonspunkter.find(ap => ap.definisjon.kode === FORDEL_BEREGNINGSGRUNNLAG);
    const isAksjonspunktClosed = !isAksjonspunktOpen(relevantAp.status.kode);
    const initialValues = buildInitialValuesFordelBeregning(ownProps);
    const hasBegrunnelse = initialValues && !!initialValues[BEGRUNNELSE_FORDELING_NAME];
    return {
      isAksjonspunktClosed,
      hasBegrunnelse,
      initialValues,
      validate: getValidationFordelBeregning(ownProps),
      onSubmit,
    };
  };
};

const FordelingForm = connect(mapStateToPropsFactory)(
  behandlingForm({ form: FORM_NAME_FORDEL_BEREGNING })(FordelingFormImpl),
);

export default FordelingForm;
