import React from 'react';
import { Alert, BodyLong, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import styles from './VedtakSjekkTilbakekreving.less';
import { SjekkTilbakekrevingType } from './VedtakForm';

interface Props {
  readOnly: boolean;
  sjekkTilbakekreving: SjekkTilbakekrevingType;
  setSjekkTilbakekreving: (sjekkTilbakekreving: SjekkTilbakekrevingType) => void;
}

export const VedtakSjekkTilbakekreving: React.FC<Props> = ({
  readOnly,
  sjekkTilbakekreving,
  setSjekkTilbakekreving,
}) => {
  const handleChange = value =>
    setSjekkTilbakekreving({
      ...sjekkTilbakekreving,
      skalBehandleTilbakekrevingFørst: value === 'ja',
      harVurdertÅSjekkeTilbakekreving: true,
    });

  return (
    <Alert className={styles.aksjonspunktAlert} variant="warning" size="medium">
      <Heading spacing size="small" level="3">
        Har åpen tilbakekrevingssak som kan bli påvirket.
      </Heading>
      <BodyLong>Vurder om tilbakekrevingssaken skal behandles først.</BodyLong>
      <VerticalSpacer twentyPx />
      <RadioGroup legend="Behandle tilbakekrevingssaken først?" onChange={handleChange} disabled={readOnly}>
        <Radio value="ja">Ja</Radio>
        <Radio value="nei">Nei</Radio>
      </RadioGroup>
    </Alert>
  );
};

export default VedtakSjekkTilbakekreving;
