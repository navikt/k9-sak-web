import React from 'react';
import GraderingUtenBG2 from './gradering/GraderingUtenBG';

const GraderingUtenBGFieldArrayComponent = ({
  fields,
  harFlereBeregningsgrunnlag,
  initialValues,
  aktivtBeregningsgrunnlagIndeks,
  submitCallback,
  readOnly,
  behandling: { id, versjon, venteArsakKode },
  aksjonspunkter,
  aktivtBeregningsgrunnlag,
  alleKodeverk,
}) => {
  if (fields.length === 0) {
    if (harFlereBeregningsgrunnlag) {
      // eslint-disable-next-line
      initialValues.forEach(initialValueObject => {
        fields.push(initialValueObject);
      });
    } else {
      fields.push(initialValues[0]);
    }
  }
  return fields.map((fieldId, index) =>
    index === aktivtBeregningsgrunnlagIndeks ? (
      <GraderingUtenBG2
        fieldArrayID={fieldId}
        submitCallback={submitCallback}
        readOnly={readOnly}
        behandlingId={id}
        behandlingVersjon={versjon}
        aksjonspunkter={aksjonspunkter}
        andelerMedGraderingUtenBG={aktivtBeregningsgrunnlag.andelerMedGraderingUtenBG}
        alleKodeverk={alleKodeverk}
        venteaarsakKode={venteArsakKode}
      />
    ) : null,
  );
};

export default GraderingUtenBGFieldArrayComponent;
