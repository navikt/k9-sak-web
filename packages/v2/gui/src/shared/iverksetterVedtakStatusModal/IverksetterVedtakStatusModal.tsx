import { k9_kodeverk_behandling_BehandlingResultatType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
import styles from './iverksetterVedtakStatusModal.module.css';

interface OwnProps {
  lukkModal: () => void;
  visModal: boolean;
  behandlingsresultat?: {
    type: string;
  };
}

/**
 * IverksetterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir den NAV-ansatte tatt tilbake til sokesiden.
 */
export const IverksetterVedtakStatusModal = ({ lukkModal, visModal, behandlingsresultat }: OwnProps) => {
  const erVedtakAvslatt =
    behandlingsresultat && behandlingsresultat.type === k9_kodeverk_behandling_BehandlingResultatType.AVSLÅTT;
  const imageAltText = erVedtakAvslatt ? 'Avslått' : 'Innvilget';

  return (
    <Modal className={styles.modal} open={visModal} aria-label={imageAltText} onClose={lukkModal}>
      <Modal.Body>
        <HGrid gap="space-16" columns={{ xs: '1fr 9fr 2fr' }}>
          <div className="relative">
            <CheckmarkCircleFillIcon
              className={styles.image}
              title="Vedtak er fattet"
              fontSize="1.75rem"
              style={{ color: 'var(--ax-bg-success-strong)' }}
            />
            <div className={styles.divider} />
          </div>
          <div>
            <BodyShort size="small">
              {erVedtakAvslatt ? 'Vedtak er avslått.' : 'Vedtaket ble fattet og blir nå iverksatt'}
            </BodyShort>
            <BodyShort size="small">Du kommer nå til forsiden</BodyShort>
          </div>
          <div>
            <Button variant="primary" size="small" className={styles.button} onClick={lukkModal} autoFocus>
              OK
            </Button>
          </div>
        </HGrid>
      </Modal.Body>
    </Modal>
  );
};
