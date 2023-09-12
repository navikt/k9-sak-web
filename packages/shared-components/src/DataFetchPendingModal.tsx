import { Column, Row } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Element } from 'nav-frontend-typografi';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Loader } from '@navikt/ds-react';
import styles from './dataFetchPendingModal.less';

// Skal ikke være mulig å lukke modal
const doNothing = () => undefined;

// Vent to sekund med å vise melding
const MESSAGE_DELAY_MILLIS = 2000;

interface OwnProps {
  pendingMessage: string;
}

interface OwnState {
  displayMessage: boolean;
}

/**
 * DataFetchPendingModal
 *
 * Presentasjonskomponent. Denne modalen vises når det går mer enn to sekund å polle etter serverdata.
 */
export class DataFetchPendingModal extends Component<OwnProps, OwnState> {
  timer: ReturnType<typeof setTimeout>;

  constructor(props) {
    super(props);
    this.enableMessage = this.enableMessage.bind(this);

    this.state = {
      displayMessage: false,
    };

    this.timer = setTimeout(this.enableMessage, MESSAGE_DELAY_MILLIS);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  enableMessage() {
    this.setState({ displayMessage: true });
  }

  render() {
    const { displayMessage } = this.state;
    if (!displayMessage) {
      return null;
    }

    const { pendingMessage } = this.props;

    return (
      <Modal
        className={styles.modal}
        isOpen
        closeButton={false}
        contentLabel={pendingMessage}
        onRequestClose={doNothing}
        shouldCloseOnOverlayClick={false}
      >
        <Row>
          <Column xs="2">
            <Loader className="loader" variant="neutral" size="xlarge" title="venter..." />
            <div className={styles.divider} />
          </Column>
          <Column xs="10">
            <Element className={styles.modalText}>
              <FormattedMessage id="DataFetchPendingModal.LosningenJobberMedBehandlingen" />
            </Element>
          </Column>
        </Row>
      </Modal>
    );
  }
}

export default DataFetchPendingModal;
