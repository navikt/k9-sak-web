import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { Button, Modal } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
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
      <Row>
        <Column xs="1">
          <Image
            className={styles.image}
            alt={intl.formatMessage({ id: 'MessagesModal.description' })}
            src={innvilgetImageUrl}
          />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <Element className={styles.text}>
            <FormattedMessage id="MessagesModal.text" />
          </Element>
        </Column>
        <Column xs="2">
          <Button variant="primary" className={styles.button} size="small" onClick={closeEvent} autoFocus>
            {intl.formatMessage({ id: 'MessagesModal.OK' })}
          </Button>
        </Column>
      </Row>
    </Modal.Body>
  </Modal>
);

export default injectIntl(MessagesModal);
