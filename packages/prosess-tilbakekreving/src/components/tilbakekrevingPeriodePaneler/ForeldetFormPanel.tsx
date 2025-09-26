import { FormattedMessage } from 'react-intl';

import { RadioGroupField, TextAreaField } from '@fpsak-frontend/form';
import { HGrid } from '@navikt/ds-react';

const ForeldetFormPanel = () => (
  <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
    <div>
      <TextAreaField name="foreldetBegrunnelse" label={{ id: 'ForeldetPanel.Vurdering' }} readOnly />
    </div>
    <div>
      <RadioGroupField
        name="periodenErForeldet"
        readOnly
        label={<FormattedMessage id="ForeldetPanel.VurderOmPeriodenErForeldet" />}
        radios={[{ value: true, label: <FormattedMessage id="ForeldetPanel.PeriodenErForeldet" /> }]}
      />
    </div>
  </HGrid>
);

export default ForeldetFormPanel;
