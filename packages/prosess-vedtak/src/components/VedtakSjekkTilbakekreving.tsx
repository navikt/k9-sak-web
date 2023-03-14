import React from 'react';
import { Alert, BodyLong, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FormattedMessage } from 'react-intl';
import styles from './VedtakSjekkTilbakekreving.less';

interface Props {
  readOnly: boolean;
  submitCallback: (aksjonspunktData: any) => void;
}

export const VedtakSjekkTilbakekreving: React.FC<Props> = ({ readOnly, submitCallback }: Props) => {
  const [deaktiverKnapp, setDeaktiverKnapp] = React.useState<boolean>(true);
  const [aktivert, setAktivert] = React.useState<boolean>(false);

  const handleChange = value => {
    setDeaktiverKnapp(value === 'ja');
    setAktivert(true);
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
        <Button variant="primary" onClick={handleSubmit} type="button" disabled={deaktiverKnapp}>
          <FormattedMessage id="VedtakForm.SjekkTilbakekreving.Bekreft" />
        </Button>
      </Alert>
      {deaktiverKnapp && aktivert && (
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
