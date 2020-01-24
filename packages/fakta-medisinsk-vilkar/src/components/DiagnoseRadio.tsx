import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface DiagnoseRadioProps {
  readOnly: boolean;
}

const DiagnoseRadio: React.FunctionComponent<DiagnoseRadioProps> = ({ readOnly }) => (
  <>
    <Element>
      <FormattedMessage id="MedisinskVilkarForm.Diagnose" />
    </Element>
    <VerticalSpacer eightPx />
    <RadioGroupField name="diagnose" bredde="M" validate={[required]} readOnly={readOnly}>
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
    </RadioGroupField>
  </>
);

export default DiagnoseRadio;
