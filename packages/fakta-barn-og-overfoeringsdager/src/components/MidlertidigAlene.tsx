import React, { FunctionComponent } from 'react';
import { CheckboxField } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';

interface MidlertidigAleneProps {
  readOnly?: boolean;
}

const MidlertidigAlene: FunctionComponent<MidlertidigAleneProps> = ({ readOnly }) => (
  <CheckboxField
    name="midlertidigAleneansvar.erMidlertidigAlene"
    label={<FormattedMessage id="FaktaRammevedtak.ErMidlertidigAlene" />}
    readOnly={readOnly}
  />
);

export default MidlertidigAlene;
