import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { Normaltekst } from 'nav-frontend-typografi';
import { flatten, required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

/**
 * NyIArbeidslivetSNForm
 *
 * Presentasjonskomponent. Setter opp fakta om beregning tilfelle VURDER_SN_NY_I_ARBEIDSLIVET som ber
 * bruker bestemme om en søker er selvstendig næringsdrivende og ny i arbeidslivet med en radioknapp.
 */

const radioGroupFieldName = 'erSNNyIArbeidslivet';

const NyIArbeidslivetSNForm = ({ readOnly, isAvklaringsbehovClosed, fieldArrayID }) => (
  <div>
    <Normaltekst>
      <FormattedMessage id="BeregningInfoPanel.NyIArbeidslivet.SelvstendigNaeringsdrivende" />
    </Normaltekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      name={`${fieldArrayID}.${radioGroupFieldName}`}
      validate={[required]}
      readOnly={readOnly}
      isEdited={isAvklaringsbehovClosed}
    >
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
    </RadioGroupField>
  </div>
);

NyIArbeidslivetSNForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

NyIArbeidslivetSNForm.buildInitialValues = beregningsgrunnlag => {
  const initialValues = {};
  if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode) {
    return initialValues;
  }
  const alleAndeler = beregningsgrunnlag.beregningsgrunnlagPeriode.map(
    periode => periode.beregningsgrunnlagPrStatusOgAndel,
  );
  const snAndeler = flatten(alleAndeler).filter(
    andel => andel.aktivitetStatus === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  if (snAndeler.length > 0) {
    initialValues[radioGroupFieldName] = snAndeler[0].erNyIArbeidslivet;
  }
  return initialValues;
};

NyIArbeidslivetSNForm.transformValues = values => ({
  vurderNyIArbeidslivet: { erNyIArbeidslivet: values[radioGroupFieldName] },
});

export default NyIArbeidslivetSNForm;
