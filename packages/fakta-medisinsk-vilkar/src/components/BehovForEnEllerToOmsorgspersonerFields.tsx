import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { minLength, maxLength, required, hasValidText } from '@fpsak-frontend/utils';

interface BehovForKontinuerligTilsynOgPleieFieldsProps {
  readOnly: boolean;
  fieldId: string;
}

const BehovForEnEllerToOmsorgspersonerFields: React.FunctionComponent<BehovForKontinuerligTilsynOgPleieFieldsProps> = ({
  readOnly,
  fieldId,
}) => (
  <>
    <Element>
      <FormattedMessage id="MedisinskVilkarForm.BehovForEnEllerToOmsorgspersoner" />
    </Element>
    <VerticalSpacer eightPx />
    <TextAreaField
      name={`begrunnelse_${fieldId}`}
      label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
      validate={[required, minLength(3), maxLength(400), hasValidText]}
      readOnly={readOnly}
    />
    <RadioGroupField name={`antallOmsorgspersoner_${fieldId}`} bredde="M" validate={[required]} readOnly={readOnly}>
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
    </RadioGroupField>
  </>
);

export default BehovForEnEllerToOmsorgspersonerFields;
