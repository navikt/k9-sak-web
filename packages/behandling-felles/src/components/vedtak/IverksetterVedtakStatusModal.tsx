import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { Image } from '@fpsak-frontend/shared-components';
import { Kodeverk } from '@k9-sak-web/types';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
import styles from './iverksetterVedtakStatusModal.module.css';

interface OwnProps {
  lukkModal: () => void;
  visModal: boolean;
  behandlingsresultat?: {
    type: Kodeverk;
  };
}

/**
 * IverksetterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir den NAV-ansatte tatt tilbake til sokesiden.
 */
// Helper to get iverksetter status text
const getIverksetterText = (code: string): string => {
  const texts: Record<string, string> = {
    'IverksetterVedtakStatusModal.Opprettet': 'Vedtaket er sendt til iverksettelse',
    'IverksetterVedtakStatusModal.VedtakIverksatt': 'Vedtaket er iverksatt',
  };
  return texts[code] || code;
};

const IverksetterVedtakStatusModal = ({
  intl,
  lukkModal,
  visModal,
  behandlingsresultat,
}: OwnProps & WrappedComponentProps) => {
  const erVedtakAvslatt = behandlingsresultat && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT;
  const imageAltText = intl.formatMessage({
    id: erVedtakAvslatt ? 'IverksetterVedtakStatusModal.Avslatt' : 'IverksetterVedtakStatusModal.Innvilget',
  });

  return (
    <Modal className={styles.modal} open={visModal} aria-label={imageAltText} onClose={lukkModal}>
      <Modal.Body>
        <HGrid gap="space-16" columns={{ xs: '1fr 9fr 2fr' }}>
          <div className="relative">
            <Image className={styles.image} alt={imageAltText} src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </div>
          <div>
            <BodyShort size="small">
              {erVedtakAvslatt ? 'Vedtaket er avslått' : 'Vedtaket er innvilget'}
            </BodyShort>
            <BodyShort size="small">
              Du kommer nå til forsiden.
            </BodyShort>
          </div>
          <div>
            <Button variant="primary" size="small" className={styles.button} onClick={lukkModal} autoFocus>
              {"Ok"}
            </Button>
          </div>
        </HGrid>
      </Modal.Body>
    </Modal>
  );
};

export default injectIntl(IverksetterVedtakStatusModal);
