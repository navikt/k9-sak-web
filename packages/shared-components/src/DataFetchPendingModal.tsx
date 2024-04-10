import { HGrid, Label, Loader, Modal } from '@navikt/ds-react';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './dataFetchPendingModal.module.css';

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
      <Modal className={styles.modal} open aria-label={pendingMessage} onClose={doNothing}>
        <Modal.Body>
          <HGrid gap="1" columns={{ xs: '2fr 10fr' }}>
            <div>
              <Loader className="loader" variant="neutral" size="xlarge" title="venter..." />
              <div className={styles.divider} />
            </div>
            <div>
              <Label size="small" as="p" className={styles.modalText}>
                <FormattedMessage id="DataFetchPendingModal.LosningenJobberMedBehandlingen" />
              </Label>
            </div>
          </HGrid>
        </Modal.Body>
      </Modal>
    );
  }
}

export default DataFetchPendingModal;
