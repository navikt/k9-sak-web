import innvilgetImageUrl from '@k9-sak-web/assets/images/innvilget_valgt.svg';
import { Image } from '@k9-sak-web/shared-components';
import { BodyShort, Button, HGrid, Label, Modal } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './henlagtBehandlingModal.module.css';

interface OwnProps {
  showModal: boolean;
  closeEvent: () => void;
}

/**
 * HenlagtBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir saksbehandler tatt tilbake til sokesiden.
 */
const HenlagtBehandlingModal = ({ intl, showModal, closeEvent }: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    open={showModal}
    aria-label={intl.formatMessage({ id: 'HenlagtBehandlingModal.ModalDescription' })}
    onClose={closeEvent}
    width="small"
  >
    <Modal.Body>
      <HGrid gap="1" columns={{ xs: '1fr 9fr 2fr' }}>
        <div className="relative">
          <Image
            className={styles.image}
            alt={intl.formatMessage({ id: 'HenlagtBehandlingModal.Henlagt' })}
            src={innvilgetImageUrl}
          />
          <div className={styles.divider} />
        </div>
        <div>
          <Label size="small" as="p">
            <FormattedMessage id="HenlagtBehandlingModal.BehandlingenErHenlagt" />
          </Label>
          <BodyShort size="small">
            <FormattedMessage id="HenlagtBehandlingModal.RutetTilForsiden" />
          </BodyShort>
        </div>
        <div>
          <Button variant="primary" size="small" className={styles.button} onClick={closeEvent} autoFocus>
            {intl.formatMessage({ id: 'HenlagtBehandlingModal.Ok' })}
          </Button>
        </div>
      </HGrid>
    </Modal.Body>
  </Modal>
);

export default injectIntl(HenlagtBehandlingModal);
