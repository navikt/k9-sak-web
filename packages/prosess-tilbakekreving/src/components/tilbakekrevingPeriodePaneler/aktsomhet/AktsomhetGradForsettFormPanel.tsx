import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { BodyShort, Detail } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
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
        <Row>
          <Column md="6">
            <Detail>
              <FormattedMessage id="AktsomhetGradForsettFormPanel.Andel" />
            </Detail>
            <BodyShort size="small" className={styles.labelPadding}>
              100 %
            </BodyShort>
          </Column>
          <Column md="6">
            <RadioGroupField
              label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.SkalTilleggesRenter" />}
              validate={[required]}
              name="skalDetTilleggesRenter"
              readOnly={readOnly}
            >
              <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Ja" />} value />
              <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" />} value={false} />
            </RadioGroupField>
          </Column>
        </Row>
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
