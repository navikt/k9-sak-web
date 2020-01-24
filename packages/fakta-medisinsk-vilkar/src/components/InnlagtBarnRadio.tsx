import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface InnlagtBarnRadioProps {
  readOnly: boolean;
}

const InnlagtBarnRadio: React.FunctionComponent<InnlagtBarnRadioProps> = ({ readOnly }) => (
  <>
    <Element>
      <FormattedMessage id="MedisinskVilkarForm.Innlagt" />
    </Element>
    <VerticalSpacer eightPx />
    <RadioGroupField name="innlagt" bredde="M" validate={[required]} readOnly={readOnly}>
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
    </RadioGroupField>
  </>
);

export default InnlagtBarnRadio;
