import { RadioGroupField, RadioOption } from '@k9-sak-web/form';
import { ArrowBox, VerticalSpacer } from '@k9-sak-web/shared-components';
import { required } from '@k9-sak-web/utils';
import { BodyShort, Detail, HGrid } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './aktsomhetReduksjonAvBelopFormPanel.module.css';

interface OwnProps {
  readOnly: boolean;
  erValgtResultatTypeForstoBurdeForstaatt?: boolean;
}

const AktsomhetGradForsettFormPanel = ({ readOnly, erValgtResultatTypeForstoBurdeForstaatt }: OwnProps) => (
  <div>
    <ArrowBox alignOffset={erValgtResultatTypeForstoBurdeForstaatt ? 328 : 368}>
      {erValgtResultatTypeForstoBurdeForstaatt && (
        <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
          <div>
            <Detail>
              <FormattedMessage id="AktsomhetGradForsettFormPanel.Andel" />
            </Detail>
            <BodyShort size="small" className={styles.labelPadding}>
              100 %
            </BodyShort>
          </div>
          <div>
            <RadioGroupField
              label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.SkalTilleggesRenter" />}
              validate={[required]}
              name="skalDetTilleggesRenter"
              readOnly={readOnly}
            >
              <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Ja" />} value />
              <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" />} value={false} />
            </RadioGroupField>
          </div>
        </HGrid>
      )}
      {!erValgtResultatTypeForstoBurdeForstaatt && (
        <>
          <Detail>
            <FormattedMessage id="AktsomhetGradForsettFormPanel.Andel" />
          </Detail>
          <BodyShort size="small">100 %</BodyShort>
          <VerticalSpacer eightPx />
          <BodyShort size="small">
            <FormattedMessage id="AktsomhetGradForsettFormPanel.Renter" />
          </BodyShort>
        </>
      )}
    </ArrowBox>
  </div>
);

export default AktsomhetGradForsettFormPanel;
