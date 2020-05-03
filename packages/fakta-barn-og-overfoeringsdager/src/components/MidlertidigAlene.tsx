import React, { FunctionComponent } from 'react';
import { CheckboxField, DatepickerField } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import { FlexRow } from '@fpsak-frontend/shared-components/index';

interface MidlertidigAleneProps {
  readOnly?: boolean;
  midlertidigAleneVerdi: boolean;
}

const MidlertidigAlene: FunctionComponent<MidlertidigAleneProps> = ({ readOnly, midlertidigAleneVerdi }) => (
  <FlexRow alignItemsToBaseline childrenMargin>
    <CheckboxField
      name="midlertidigAleneansvar.erMidlertidigAlene"
      label={<FormattedMessage id="FaktaRammevedtak.ErMidlertidigAlene" />}
      readOnly={readOnly}
    />
    {midlertidigAleneVerdi === true && (
      <DatepickerField
        name="midlertidigAleneansvar.tom"
        readOnly={readOnly}
        label={<FormattedMessage id="FaktaRammevedtak.MidlertidigAleneTom" />}
      />
    )}
  </FlexRow>
);

export default MidlertidigAlene;
