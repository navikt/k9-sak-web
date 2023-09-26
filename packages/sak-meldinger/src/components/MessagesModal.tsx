import { Column, Container, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';

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
const MessagesModal = ({ showModal, closeEvent, intl }: OwnProps & WrappedComponentProps) => {
  Modal.setAppElement(document.body);
  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'MessagesModal.description' })}
      onRequestClose={closeEvent}
      shouldCloseOnOverlayClick={false}
    >
      <Container className={styles.container} data-testid="MessagesModal">
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
            <Hovedknapp className={styles.button} mini onClick={closeEvent} autoFocus>
              {intl.formatMessage({ id: 'MessagesModal.OK' })}
            </Hovedknapp>
          </Column>
        </Row>
      </Container>
    </Modal>
  );
};

export default injectIntl(MessagesModal);
