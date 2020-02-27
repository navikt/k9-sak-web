import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface LegeerklaeringProps {
  readOnly: boolean;
}

const Legeerklaering = ({ readOnly }: LegeerklaeringProps) => (
  <>
    <Element>
      <FormattedMessage id="MedisinskVilkarForm.LegeErklaering" />
    </Element>
    <VerticalSpacer eightPx />
    <RadioGroupField
      direction="vertical"
      name="legeerklaeringkilde"
      bredde="M"
      validate={[required]}
      readOnly={readOnly}
    >
      <RadioOption
        dataId="sykehuslege"
        label={{ id: 'MedisinskVilkarForm.RadioknappSykehuslege' }}
        value="SYKEHUSLEGE"
      />
      <RadioOption
        label={{ id: 'MedisinskVilkarForm.RadioknappLegeISpesialhelsetjenesten' }}
        value="SPESIALISTHELSETJENESTE"
      />
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappFastlege' }} value="FASTLEGE" />
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappAnnenYrkesgruppe' }} value="ANNET" />
    </RadioGroupField>
  </>
);

export default Legeerklaering;
