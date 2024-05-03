import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@k9-sak-web/shared-components';
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
          Saken har en åpen ytelsesbehandling og en tilbakekrevingssak. Ytelsesbehandlingen kan påvirke resultatet av
          den åpne tilbakekrevingssaken.
        </Heading>
        <BodyLong>Vurder om tilbakekrevingssaken skal behandles først.</BodyLong>
        <VerticalSpacer twentyPx />
        <RadioGroup
          legend="Ønsker du å behandle tilbakekrevingssaken først?"
          onChange={handleChange}
          disabled={readOnly}
        >
          <Radio value="ja">Ja, sett denne behandlingen på vent (må gjøres via behandlingsmenyen)</Radio>
          <Radio value="nei">Nei, behandle denne behandlingen videre</Radio>
        </RadioGroup>
        <VerticalSpacer twentyPx />
        <Button size="small" variant="primary" onClick={handleSubmit} type="button" disabled={deaktiverBekreftKnapp}>
          Bekreft
        </Button>
        {redigerSjekkTilbakekreving && (
          <Button size="small" className="ml-2" variant="secondary" onClick={() => toggleSjekkTilbakekreving()}>
            Avbryt
          </Button>
        )}
      </Alert>
      {deaktiverBekreftKnapp && visAdvarselTekst && (
        <>
          <VerticalSpacer twentyPx />
          <Alert className={styles.aksjonspunktAlert} variant="error" size="small">
            <BodyLong>
              Denne behandlingen har hatt aksjonspunkt om tilbakekrevingssaken skal behandles før ytelsessaken. Det er
              mulig å endre valget.
            </BodyLong>
          </Alert>
        </>
      )}
    </>
  );
};

export default VedtakSjekkTilbakekreving;
