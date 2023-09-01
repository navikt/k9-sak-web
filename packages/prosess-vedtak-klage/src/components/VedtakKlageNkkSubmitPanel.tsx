import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';

import styles from './vedtakKlageSubmitPanel.css';

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
        <Hovedknapp
          mini
          className={styles.mainButton}
          onClick={formProps.handleSubmit}
          disabled={behandlingPaaVent || klageResultat.godkjentAvMedunderskriver}
        >
          {intl.formatMessage({ id: 'VedtakKlageForm.FattVedtak' })}
        </Hovedknapp>
      )}
    </Column>
  </Row>
);

export default injectIntl(VedtakKlageNkkSubmitPanel);
