import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { Detail, HGrid } from '@navikt/ds-react';
import Lukknapp from 'nav-frontend-lukknapp';
import React, { Component } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';
import Feilmelding from './feilmeldingTsType';

import styles from './errorMessagePanel.module.css';

interface OwnProps {
  errorMessages: Feilmelding[];
  removeErrorMessage: () => void;
}

interface StateProps {
  isModalOpen: boolean;
  selectedErrorMsgIndex?: number;
}

/**
 * ErrorMessagePanel
 *
 * Presentasjonskomponent. Definerer hvordan feilmeldinger vises.
 */
export class ErrorMessagePanel extends Component<OwnProps & WrappedComponentProps, StateProps> {
  constructor(props: OwnProps & WrappedComponentProps) {
    super(props);

    this.state = {
      isModalOpen: false,
      selectedErrorMsgIndex: undefined,
    };

    this.toggleModalOnClick = this.toggleModalOnClick.bind(this);
    this.toggleModalOnKeyDown = this.toggleModalOnKeyDown.bind(this);
  }

  toggleModalOnClick(event: React.MouseEvent | React.KeyboardEvent, index: number): void {
    const { isModalOpen } = this.state;
    this.setState({
      isModalOpen: !isModalOpen,
      selectedErrorMsgIndex: index,
    });

    if (event) event.preventDefault();
  }

  toggleModalOnKeyDown(event: React.KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleModalOnClick(event, index);
    } else {
      event.preventDefault();
    }
  }

  render() {
    const { errorMessages, removeErrorMessage, intl } = this.props;
    const { isModalOpen, selectedErrorMsgIndex } = this.state;

    if (errorMessages.length === 0) {
      return null;
    }

    return (
      <div className={styles.container}>
        {errorMessages
          .reduce((acc, cur) => {
            // Dedupe errorMessages
            if (acc.find(m => m.message === cur.message)) return acc;
            acc.push(cur);
            return acc;
          }, [])
          .map((message, index) => (
            <HGrid gap="1" columns={{ xs: '11fr 1fr' }} key={message.message}>
              <Detail className={styles.wordWrap}>{`${decodeHtmlEntity(message.message)} `}</Detail>
              {message.additionalInfo && (
                <Detail>
                  <a
                    href=""
                    onClick={event => this.toggleModalOnClick(event, index)}
                    onKeyDown={event => this.toggleModalOnKeyDown(event, index)}
                    className={styles.link}
                  >
                    <FormattedMessage id="ErrorMessagePanel.ErrorDetails" />
                  </a>
                </Detail>
              )}
            </HGrid>
          ))}
        <div className={styles.lukkContainer}>
          <Lukknapp hvit onClick={removeErrorMessage}>
            {intl.formatMessage({ id: 'ErrorMessagePanel.Close' })}
          </Lukknapp>
        </div>
        {isModalOpen && (
          <ErrorMessageDetailsModal
            showModal={isModalOpen}
            closeModalFn={this.toggleModalOnClick as () => void}
            errorDetails={errorMessages[selectedErrorMsgIndex].additionalInfo}
          />
        )}
      </div>
    );
  }
}

export default injectIntl(ErrorMessagePanel);
