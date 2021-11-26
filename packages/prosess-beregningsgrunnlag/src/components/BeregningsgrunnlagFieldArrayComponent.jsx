import React from 'react';
import BeregningForm2 from './beregningForm/BeregningForm';



const BeregningsgrunnlagFieldArrayComponent = ({
  fields,
  initialValues,
  aktivtBeregningsgrunnlagIndeks,
  beregningsgrunnlag,
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
  return fields.map((fieldId, index) => (<BeregningForm2
      key={fieldId}
      erAktiv={index === aktivtBeregningsgrunnlagIndeks}
      readOnly={readOnly || !fields.get(index).erTilVurdering}
      fieldArrayID={fieldId}
      beregningsgrunnlag={beregningsgrunnlag[index]}
      avklaringsbehov={fields.get(index).avklaringsbehov}
      relevanteStatuser={fields.get(index).relevanteStatuser}
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
