import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Alert, BodyLong, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './VedtakSjekkTilbakekreving.css';

interface Props {
  readOnly: boolean;
  submitCallback: (aksjonspunktData: any) => void;
}

export const VedtakSjekkTilbakekreving: React.FC<Props> = ({ readOnly, submitCallback }: Props) => {
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
          <FormattedMessage id="VedtakForm.SjekkTilbakekreving.Overskrift" />
        </Heading>
        <BodyLong>
          <FormattedMessage id="VedtakForm.SjekkTilbakekreving.Beskrivelse" />
        </BodyLong>
        <VerticalSpacer twentyPx />
        <RadioGroup legend="Behandle tilbakekrevingssaken først?" onChange={handleChange} disabled={readOnly}>
          <Radio value="ja">
            <FormattedMessage id="VedtakForm.SjekkTilbakekreving.Ja" />
          </Radio>
          <Radio value="nei">
            <FormattedMessage id="VedtakForm.SjekkTilbakekreving.Nei" />
          </Radio>
        </RadioGroup>
        <VerticalSpacer twentyPx />
        <Button variant="primary" onClick={handleSubmit} type="button" disabled={deaktiverBekreftKnapp}>
          <FormattedMessage id="VedtakForm.SjekkTilbakekreving.Bekreft" />
        </Button>
      </Alert>
      {deaktiverBekreftKnapp && visAdvarselTekst && (
        <>
          <VerticalSpacer twentyPx />
          <Alert className={styles.aksjonspunktAlert} variant="error" size="small">
            <BodyLong>
              <FormattedMessage id="VedtakForm.SjekkTilbakekreving.Advarsel" />
            </BodyLong>
          </Alert>
        </>
      )}
    </>
  );
};

export default VedtakSjekkTilbakekreving;
