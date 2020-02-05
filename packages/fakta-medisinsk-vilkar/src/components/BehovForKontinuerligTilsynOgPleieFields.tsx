import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { VerticalSpacer, FlexRow, FlexColumn } from '@fpsak-frontend/shared-components';
import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { minLength, maxLength, required, hasValidText } from '@fpsak-frontend/utils';
import MedisinskVilkårValues from '../types/MedisinskVilkårValues';

interface BehovForKontinuerligTilsynOgPleieFieldsProps {
  readOnly: boolean;
}

const BehovForKontinuerligTilsynOgPleieFields: React.FunctionComponent<BehovForKontinuerligTilsynOgPleieFieldsProps> = ({
  readOnly,
}) => (
  <FlexRow>
    <FlexColumn>
      <Element>
        <FormattedMessage id="MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie" />
      </Element>
      <VerticalSpacer eightPx />
      <TextAreaField
        name="begrunnelse"
        label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
        validate={[required, minLength(3), maxLength(400), hasValidText]}
        readOnly={readOnly}
      />
      <RadioGroupField
        name={MedisinskVilkårValues.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
        bredde="M"
        validate={[required]}
        readOnly={readOnly}
      >
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
      </RadioGroupField>
    </FlexColumn>
  </FlexRow>
);

export default BehovForKontinuerligTilsynOgPleieFields;
