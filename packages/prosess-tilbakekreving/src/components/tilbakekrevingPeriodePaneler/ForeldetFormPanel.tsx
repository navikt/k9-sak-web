import React from 'react';
import { FormattedMessage } from 'react-intl';

import { RadioGroupField, RadioOption, TextAreaField } from '@k9-sak-web/form';
import { HGrid } from '@navikt/ds-react';

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
        {[<RadioOption key={1} label={<FormattedMessage id="ForeldetPanel.PeriodenErForeldet" />} value />]}
      </RadioGroupField>
    </div>
  </HGrid>
);

export default ForeldetFormPanel;
