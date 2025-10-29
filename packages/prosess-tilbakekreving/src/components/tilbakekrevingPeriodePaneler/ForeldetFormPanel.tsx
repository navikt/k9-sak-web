
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
        label={Vurder om perioden er foreldet}
        radios={[{ value: true, label: Perioden er foreldet }]}
      />
    </div>
  </HGrid>
);

export default ForeldetFormPanel;
