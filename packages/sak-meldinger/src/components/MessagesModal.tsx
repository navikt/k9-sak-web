import innvilgetImageUrl from '@k9-sak-web/assets/images/innvilget_valgt.svg';
import { Image } from '@k9-sak-web/shared-components';
import { Button, HGrid, Label, Modal } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './MessagesModal.module.css';

interface OwnProps {
  showModal: boolean;
  closeEvent: () => void;
}

/**
 * MessagesModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at et brev har blitt bestilt.
 * Ved å trykke på knapp blir fritekst-feltet tømt.
 */
const MessagesModal = ({ showModal, closeEvent, intl }: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    open={showModal}
    aria-label={intl.formatMessage({ id: 'MessagesModal.description' })}
    onClose={closeEvent}
    data-testid="MessagesModal"
    width="small"
  >
    <Modal.Body>
      <HGrid gap="1" columns={{ xs: '1fr 9fr 2fr' }}>
        <div className="relative">
          <Image
            className={styles.image}
            alt={intl.formatMessage({ id: 'MessagesModal.description' })}
            src={innvilgetImageUrl}
          />
          <div className={styles.divider} />
        </div>
        <div>
          <Label size="small" as="p" className={styles.text}>
            <FormattedMessage id="MessagesModal.text" />
          </Label>
        </div>
        <div>
          <Button variant="primary" className={styles.button} size="small" onClick={closeEvent} autoFocus>
            {intl.formatMessage({ id: 'MessagesModal.OK' })}
          </Button>
        </div>
      </HGrid>
    </Modal.Body>
  </Modal>
);

export default injectIntl(MessagesModal);
