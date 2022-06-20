import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes, FieldArray } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { behandlingForm } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import avklaringsbehovCodes, { harAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { FaktaBegrunnelseTextField, FaktaSubmitButton } from '@k9-sak-web/fakta-felles';

import FordelBeregningsgrunnlagForm from './fordeling/FordelBeregningsgrunnlagForm';
import FordelingHelpText from './FordelingHelpText';
import beregningAvklaringsbehovPropType from '../propTypes/beregningAvklaringsbehovPropType';

const { FORDEL_BEREGNINGSGRUNNLAG } = avklaringsbehovCodes;

const FORM_NAME_FORDEL_BEREGNING = 'fordelBeregningsgrunnlagForm';

const findAvklaringsbehovMedBegrunnelse = avklaringsbehov =>
  avklaringsbehov.find(ab => ab.definisjon === FORDEL_BEREGNINGSGRUNNLAG && ab.begrunnelse !== null);

const BEGRUNNELSE_FORDELING_NAME = 'begrunnelseFordeling';

const fieldArrayName = 'fordelingListe';

const renderFordeling = ({
  fields,
  readOnly,
  isAvklaringsbehovClosed,
  beregningsgrunnlag,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  behandlingType,
  avklaringsbehov,
  kreverManuellBehandling,
  aktivtBeregningsgrunnlagIndex,
}) =>
  fields.map(
    (field, index) =>
      index === aktivtBeregningsgrunnlagIndex && (
        <div key={field}>
          {kreverManuellBehandling && (
            <>
              <FordelingHelpText
                isAvklaringsbehovClosed={isAvklaringsbehovClosed}
                alleKodeverk={alleKodeverk}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                avklaringsbehov={avklaringsbehov}
                beregningsgrunnlag={beregningsgrunnlag}
              />
              <VerticalSpacer twentyPx />
            </>
          )}
          <FordelBeregningsgrunnlagForm
            readOnly={readOnly}
            isAvklaringsbehovClosed={isAvklaringsbehovClosed}
            beregningsgrunnlag={beregningsgrunnlag}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            behandlingType={behandlingType}
            grunnlagFieldId={field}
          />
        </div>
      ),
  );

/**
 * FordelingForm
 *
 * Container komponent. Har ansvar for å sette opp Redux Formen for "avklar fakta om fordeling" panel.
 */
const FordelingFormImpl = ({
  readOnly,
  submittable,
  isAvklaringsbehovClosed,
  hasBegrunnelse,
  submitEnabled,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  behandlingType,
  avklaringsbehov,
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
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      beregningsgrunnlag={beregningsgrunnlag}
      behandlingType={behandlingType}
      avklaringsbehov={avklaringsbehov}
      kreverManuellBehandling={kreverManuellBehandling}
      aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndex}
      hasBegrunnelse={hasBegrunnelse}
      isAvklaringsbehovClosed={isAvklaringsbehovClosed}
      formProps={formProps}
    />
    <VerticalSpacer twentyPx />
    {kreverManuellBehandling && (
      <>
        <FaktaBegrunnelseTextField
          name={BEGRUNNELSE_FORDELING_NAME}
          isSubmittable={submittable}
          isReadOnly={readOnly}
          hasBegrunnelse={hasBegrunnelse}
        />
        <VerticalSpacer twentyPx />
        <FaktaSubmitButton
          formName={formProps.form}
          isSubmittable={submittable && submitEnabled}
          isReadOnly={readOnly}
          hasOpenAksjonspunkter={!isAvklaringsbehovClosed}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      </>
    )}
  </form>
);

FordelingFormImpl.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  submitEnabled: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  kreverManuellBehandling: PropTypes.bool.isRequired,
  aktivtBeregningsgrunnlagIndex: PropTypes.number.isRequired,
  ...formPropTypes,
};

const kreverManuellBehandlingFn = bg => {
  const fordeling = bg.faktaOmFordeling;
  if (fordeling) {
    const fordelBg = fordeling.fordelBeregningsgrunnlag;
    if (fordelBg) {
      return fordelBg.fordelBeregningsgrunnlagPerioder.some(p => p.skalRedigereInntekt);
    }
  }
  return false;
};

const mapGrunnlagsliste = (fieldArrayList, alleBeregningsgrunnlag, vilkårsperioder) =>
  fieldArrayList
    .map((currentFormValues, index) => {
      const bg = alleBeregningsgrunnlag[index];
      const stpOpptjening = bg.faktaOmBeregning.avklarAktiviteter.skjæringstidspunkt;
      const vilkarPeriode = vilkårsperioder.find(periode => periode.periode.fom === stpOpptjening);
      return {
        periode: vilkarPeriode.periode,
        ...FordelBeregningsgrunnlagForm.transformValues(currentFormValues, bg),
      };
    });

export const transformValuesFordelBeregning = createSelector(
  [
    ownProps => ownProps.alleBeregningsgrunnlag,
    ownProps => ownProps.avklaringsbehov,
    ownProps => ownProps.vilkårsperioder,
  ],
  (alleBeregningsgrunnlag, avklaringsbehov, vilkårsperioder) => values => {
    if (harAvklaringsbehov(FORDEL_BEREGNINGSGRUNNLAG, avklaringsbehov)) {
      const fieldArrayList = values[fieldArrayName];
      const faktaBeregningValues = values;
      const begrunnelse = faktaBeregningValues[BEGRUNNELSE_FORDELING_NAME];
      return [
        {
          begrunnelse,
          kode: FORDEL_BEREGNINGSGRUNNLAG, // TODO: Usikker på om denne skal gjøres om eller ikke
          grunnlag: mapGrunnlagsliste(fieldArrayList, alleBeregningsgrunnlag, vilkårsperioder),
        },
      ];
    }
    return {};
  },
);

export const buildInitialValuesFordelBeregning = createSelector(
  [
    ownProps => ownProps.alleBeregningsgrunnlag,
    ownProps => ownProps.alleKodeverk,
    ownProps => ownProps.arbeidsgiverOpplysningerPerId,
    ownProps => ownProps.avklaringsbehov,
  ],
  (alleBeregningsgrunnlag, alleKodeverk, arbeidsgiverOpplysningerPerId, avklaringsbehov) => {
    if (!harAvklaringsbehov(FORDEL_BEREGNINGSGRUNNLAG, avklaringsbehov)) {
      return {};
    }
    return {
      ...FaktaBegrunnelseTextField.buildInitialValues(
        findAvklaringsbehovMedBegrunnelse(avklaringsbehov),
        BEGRUNNELSE_FORDELING_NAME,
      ),
      [fieldArrayName]: alleBeregningsgrunnlag.map(bg =>
        FordelBeregningsgrunnlagForm.buildInitialValues(
          bg,
          getKodeverknavnFn(alleKodeverk, kodeverkTyper),
          arbeidsgiverOpplysningerPerId,
        ),
      ),
    };
  },
);

export const getValidationFordelBeregning = createSelector(
  [
    ownProps => ownProps.alleBeregningsgrunnlag,
    ownProps => ownProps.alleKodeverk,
    ownProps => ownProps.arbeidsgiverOpplysningerPerId,
  ],
  (alleBeregningsgrunnlag, alleKodeverk, arbeidsgiverOpplysningerPerId) => values => {
    const fieldArrayList = values[fieldArrayName];
    if (!fieldArrayList) {
      return null;
    }
    const errors = {};
    errors[fieldArrayName] = fieldArrayList
      .filter((currentFormValues, index) => kreverManuellBehandlingFn(alleBeregningsgrunnlag[index]))
      .map((currentFormValues, index) => {
        const bg = alleBeregningsgrunnlag[index];
        return {
          ...FordelBeregningsgrunnlagForm.validate(
            currentFormValues,
            bg,
            getKodeverknavnFn(alleKodeverk, kodeverkTyper),
            arbeidsgiverOpplysningerPerId,
          ),
        };
      });
    return errors;
  },
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback(transformValuesFordelBeregning(initialOwnProps)(values));
  return (state, ownProps) => {
    const relevantAb = ownProps.avklaringsbehov.find(ab => ab.definisjon === FORDEL_BEREGNINGSGRUNNLAG);
    const isAvklaringsbehovClosed = !isAvklaringsbehovOpen(relevantAb.status);
    const initialValues = buildInitialValuesFordelBeregning(ownProps);
    const hasBegrunnelse = initialValues && !!initialValues[BEGRUNNELSE_FORDELING_NAME];
    return {
      isAvklaringsbehovClosed,
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
