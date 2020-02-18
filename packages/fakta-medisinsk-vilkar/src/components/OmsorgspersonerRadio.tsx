import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import MedisinskVilkårValues from '../types/MedisinskVilkårValues';

interface OmsorgspersonerRadioProps {
  readOnly: boolean;
}

const OmsorgspersonerRadio: React.FunctionComponent<OmsorgspersonerRadioProps> = ({ readOnly }) => (
  <>
    <Element>
      <FormattedMessage id="MedisinskVilkarForm.Omsorgspersoner" />
    </Element>
    <VerticalSpacer eightPx />
    <RadioGroupField
      name={MedisinskVilkårValues.HAR_BEHOV_FOR_TO_OMSORGSPERSONER}
      bredde="M"
      validate={[required]}
      readOnly={readOnly}
    >
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
    </RadioGroupField>
  </>
);

export default OmsorgspersonerRadio;
