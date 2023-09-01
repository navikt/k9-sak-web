import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import styles from './aktsomhetReduksjonAvBelopFormPanel.css';

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
            <Undertekst>
              <FormattedMessage id="AktsomhetGradForsettFormPanel.Andel" />
            </Undertekst>
            <Normaltekst className={styles.labelPadding}>100 %</Normaltekst>
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
          <Undertekst>
            <FormattedMessage id="AktsomhetGradForsettFormPanel.Andel" />
          </Undertekst>
          <Normaltekst>100 %</Normaltekst>
          <VerticalSpacer eightPx />
          <Normaltekst>
            <FormattedMessage id="AktsomhetGradForsettFormPanel.Renter" />
          </Normaltekst>
        </>
      )}
    </ArrowBox>
  </div>
);

export default AktsomhetGradForsettFormPanel;
