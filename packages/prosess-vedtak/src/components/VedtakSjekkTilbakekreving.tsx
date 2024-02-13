import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Alert, BodyLong, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import React from 'react';
import styles from './VedtakSjekkTilbakekreving.module.css';

interface Props {
  readOnly: boolean;
  redigerSjekkTilbakekreving: boolean;
  submitCallback: (aksjonspunktData: any) => void;
  toggleSjekkTilbakekreving: () => void;
}

export const VedtakSjekkTilbakekreving: React.FC<Props> = ({
  readOnly,
  redigerSjekkTilbakekreving = false,
  toggleSjekkTilbakekreving = () => {},
  submitCallback,
}: Props) => {
  const [deaktiverBekreftKnapp, setDeaktiverBekreftKnapp] = React.useState<boolean>(true);
  const [visAdvarselTekst, setVisAdvarselTekst] = React.useState<boolean>(false);

  const handleChange = value => {
    setDeaktiverBekreftKnapp(value === 'ja');
    setVisAdvarselTekst(true);
  };

  const handleSubmit = () => submitCallback([{ kode: aksjonspunktCodes.SJEKK_TILBAKEKREVING }]);

  return (
    <>
      <Alert className={styles.aksjonspunktAlert} variant="warning" size="medium">
        <Heading spacing size="small" level="3">
          Har åpen tilbakekrevingssak som kan bli påvirket
        </Heading>
        <BodyLong>Vurder om tilbakekrevingssaken skal behandles først.</BodyLong>
        <VerticalSpacer twentyPx />
        <RadioGroup legend="Behandle tilbakekrevingssaken først?" onChange={handleChange} disabled={readOnly}>
          <Radio value="ja">Ja</Radio>
          <Radio value="nei">Nei</Radio>
        </RadioGroup>
        <VerticalSpacer twentyPx />
        <Button variant="primary" onClick={handleSubmit} type="button" disabled={deaktiverBekreftKnapp}>
          Bekreft
        </Button>
        {redigerSjekkTilbakekreving && (
          <Button className="ml-2" variant="secondary" onClick={() => toggleSjekkTilbakekreving()}>
            Avbryt
          </Button>
        )}
      </Alert>
      {deaktiverBekreftKnapp && visAdvarselTekst && (
        <>
          <VerticalSpacer twentyPx />
          <Alert className={styles.aksjonspunktAlert} variant="error" size="small">
            <BodyLong>Sett behandlingen på vent og behandle tilbakekrevingssaken først</BodyLong>
          </Alert>
        </>
      )}
    </>
  );
};

export default VedtakSjekkTilbakekreving;
