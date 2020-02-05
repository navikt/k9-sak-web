import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { minLength, maxLength, required, hasValidText } from '@fpsak-frontend/utils';

interface BehovForKontinuerligTilsynOgPleieFieldsProps {
  readOnly: boolean;
}

const BehovForKontinuerligTilsynOgPleieFields: React.FunctionComponent<BehovForKontinuerligTilsynOgPleieFieldsProps> = ({
  readOnly,
}) => (
  <>
    <Element>
      <FormattedMessage id="MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie" />
    </Element>
    <VerticalSpacer eightPx />
    <TextAreaField
      name="begrunnelse"
      label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
      validate={[required, minLength(3), maxLength(400), hasValidText]}
      readOnly={readOnly}
    />
    <RadioGroupField name="harBehovForKontinuerligTilsynOgPleie" bredde="M" validate={[required]} readOnly={readOnly}>
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
    </RadioGroupField>
  </>
);

export default BehovForKontinuerligTilsynOgPleieFields;
