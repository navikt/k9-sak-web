import { CheckboxField, TextAreaField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Detail } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import AktsomhetReduksjonAvBelopFormPanel from './AktsomhetReduksjonAvBelopFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

interface OwnProps {
  harGrunnerTilReduksjon?: boolean;
  readOnly: boolean;
  handletUaktsomhetGrad: string;
  erSerligGrunnAnnetValgt: boolean;
  harMerEnnEnYtelse: boolean;
  feilutbetalingBelop: number;
  andelSomTilbakekreves?: string;
  sarligGrunnTyper?: KodeverkMedNavn[];
}

const AktsomhetSarligeGrunnerFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  andelSomTilbakekreves,
}: OwnProps) => (
  <div>
    <Detail>
      <FormattedMessage id="AktsomhetSarligeGrunnerFormPanel.GrunnerTilReduksjon" />
    </Detail>
    <VerticalSpacer eightPx />
    {sarligGrunnTyper.map((sgt: KodeverkMedNavn) => (
      <React.Fragment key={sgt.kode}>
        <CheckboxField key={sgt.kode} name={sgt.kode} label={sgt.navn} readOnly={readOnly} />
        <VerticalSpacer eightPx />
      </React.Fragment>
    ))}
    {erSerligGrunnAnnetValgt && (
      <Row>
        <Column md="1" />
        <Column md="10">
          <TextAreaField
            name="annetBegrunnelse"
            label=""
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
            dataId="annetBegrunnelse"
          />
        </Column>
      </Row>
    )}
    <AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon={harGrunnerTilReduksjon}
      readOnly={readOnly}
      handletUaktsomhetGrad={handletUaktsomhetGrad}
      harMerEnnEnYtelse={harMerEnnEnYtelse}
      feilutbetalingBelop={feilutbetalingBelop}
      andelSomTilbakekreves={andelSomTilbakekreves}
    />
  </div>
);

export default AktsomhetSarligeGrunnerFormPanel;
