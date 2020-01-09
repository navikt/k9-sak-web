import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

interface LegeerklaeringProps {
  readOnly: boolean;
}

const Legeerklaering = ({ readOnly }: LegeerklaeringProps) => (
  <>
    <Element>
      <FormattedMessage id="MedisinskVilkarForm.LegeErklaering" />
    </Element>
    <VerticalSpacer eightPx />
    <RadioGroupField direction="vertical" name="legeerklaering" bredde="M" validate={[required]} readOnly={readOnly}>
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappSykehuslege' }} value="Sykehuslege" />
      <RadioOption
        label={{ id: 'MedisinskVilkarForm.RadioknappLegeISpesialhelsetjenesten' }}
        value="legeispesialisthelsetjenesten"
      />
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappFastlege' }} value="fastlege" />
      <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappAnnenYrkesgruppe' }} value="annenyrkesgruppe" />
    </RadioGroupField>
    <TextAreaField
      name="begrunnelse_legeerklaering"
      label={<FormattedMessage id="MedisinskVilkarForm.NotatKommentar" />}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
    />
  </>
);

export default Legeerklaering;
