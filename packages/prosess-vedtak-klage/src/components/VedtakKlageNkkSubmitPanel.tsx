import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';

import { Button } from '@navikt/ds-react';
import styles from './vedtakKlageSubmitPanel.module.css';

interface Props {
  klageResultat: {
    godkjentAvMedunderskriver;
  };
  formProps: { handleSubmit: () => void };
  readOnly: boolean;
  behandlingPaaVent: boolean;
}
/**
 *
 * Håndterer aksjonspunktet for vedtak når klagen er vurdert av NKK
 * VKI oppgave oppretter et aksjonspunkt som en huskelapp for saksbehandlere
 * som da må trykke på "Fatt Vedtak" for å gå videre/fullføre aksjonspunktet.
 *
 * Dette gjelder aksjonspunkt 5034, VURDERE_DOKUMENT, med klagevurdertav NKK
 *
 * @param intl
 * @param readOnly
 * @param behandlingPaaVent
 * @param klageResultat
 * @param formProps - Handle submit funksjonen fra Redux Forms, fullfører aksjonspunktet
 */
const VedtakKlageNkkSubmitPanel = ({
  intl,
  klageResultat,
  formProps,
  readOnly,
  behandlingPaaVent,
}: Props & WrappedComponentProps) => (
  <Row>
    <Column xs="8">
      {!readOnly && (
        <Button
          variant="primary"
          size="small"
          className={styles.mainButton}
          onClick={formProps.handleSubmit}
          disabled={behandlingPaaVent || klageResultat.godkjentAvMedunderskriver}
        >
          {intl.formatMessage({ id: 'VedtakKlageForm.FattVedtak' })}
        </Button>
      )}
    </Column>
  </Row>
);

export default injectIntl(VedtakKlageNkkSubmitPanel);
