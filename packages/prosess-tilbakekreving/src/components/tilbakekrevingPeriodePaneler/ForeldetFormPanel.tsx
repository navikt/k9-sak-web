import React from 'react';
import { FormattedMessage } from 'react-intl';

import { RadioGroupField, TextAreaField } from '@fpsak-frontend/form';
import { HGrid, Radio } from '@navikt/ds-react';

const ForeldetFormPanel = () => (
  <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
    <div>
      <TextAreaField name="foreldetBegrunnelse" label={{ id: 'ForeldetPanel.Vurdering' }} readOnly />
    </div>
    <div>
      <RadioGroupField
        name="periodenErForeldet"
        readOnly
        label={<FormattedMessage id="ForeldetPanel.VurderOmPeriodenErForeldet" />}
      >
        <Radio value>
          <FormattedMessage id="ForeldetPanel.PeriodenErForeldet" />
        </Radio>
      </RadioGroupField>
    </div>
  </HGrid>
);

export default ForeldetFormPanel;
