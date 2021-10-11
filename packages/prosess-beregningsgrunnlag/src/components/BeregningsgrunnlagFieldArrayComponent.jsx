import React from 'react';
import BeregningForm2 from './beregningForm/BeregningForm';


const BeregningsgrunnlagFieldArrayComponent = ({
  fields,
  initialValues,
  aktivtBeregningsgrunnlagIndeks,
  aktivtBeregningsgrunnlag,
  avklaringsbehov,
  relevanteStatuser,
  submitCallback,
  readOnlySubmitButton,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  behandling,
  readOnly,
  bgSkalVurderes,
  vilkaarBG,
}) => {
  if (fields.length === 0) {
    initialValues.forEach(initialValueObject => {
      fields.push(initialValueObject);
    });
  }
  return fields.map((fieldId, index) => (
    (index === aktivtBeregningsgrunnlagIndeks) &&
    <BeregningForm2
      key={fieldId}
      erAktiv={index === aktivtBeregningsgrunnlagIndeks}
      readOnly={readOnly || !bgSkalVurderes}
      fieldArrayID={fieldId}
      beregningsgrunnlag={aktivtBeregningsgrunnlag}
      avklaringsbehov={avklaringsbehov}
      relevanteStatuser={relevanteStatuser}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      behandling={behandling}
      vilkaarBG={vilkaarBG}
      initialValues={initialValues[index]}
    />
  ));
};

export default BeregningsgrunnlagFieldArrayComponent;
