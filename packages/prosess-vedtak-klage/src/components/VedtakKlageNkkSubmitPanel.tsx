import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';

import { Button, HGrid } from '@navikt/ds-react';
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
  <HGrid gap="1" columns={{ xs: '8fr 4fr' }}>
    <div>
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
    </div>
  </HGrid>
);

export default injectIntl(VedtakKlageNkkSubmitPanel);
