import React from 'react';
import BeregningForm2 from './beregningForm/BeregningForm';

const BeregningsgrunnlagFieldArrayComponent = ({
  fields,
  initialValues,
  aktivtBeregningsgrunnlagIndeks,
  aktivtBeregningsgrunnlag,
  gjeldendeAksjonspunkter,
  relevanteStatuser,
  submitCallback,
  readOnlySubmitButton,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  behandling,
  readOnly,
  vilkaarBG,
}) => {
  if (fields.length === 0) {
    initialValues.forEach(initialValueObject => {
      fields.push(initialValueObject);
    });
  }
  return fields.map((fieldId, index) =>
    index === aktivtBeregningsgrunnlagIndeks ? (
      <BeregningForm2
        key={fieldId}
        readOnly={readOnly}
        fieldArrayID={fieldId}
        beregningsgrunnlag={aktivtBeregningsgrunnlag}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        relevanteStatuser={relevanteStatuser}
        submitCallback={submitCallback}
        readOnlySubmitButton={readOnlySubmitButton}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        behandling={behandling}
        vilkaarBG={vilkaarBG}
        initialValues={initialValues[index]}
      />
    ) : null,
  );
};

export default BeregningsgrunnlagFieldArrayComponent;
