import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Button, Detail, HGrid } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';
import Feilmelding from './feilmeldingTsType';

import styles from './errorMessagePanel.module.css';

interface OwnProps {
  errorMessages: Feilmelding[];
  removeErrorMessage: () => void;
}

/**
 * ErrorMessagePanel
 *
 * Presentasjonskomponent. Definerer hvordan feilmeldinger vises.
 */
export const ErrorMessagePanel = (props: OwnProps & WrappedComponentProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedErrorMsgIndex, setSelectedErrorMsgIndex] = useState<number>(undefined);

  const toggleModalOnClick = (event: React.MouseEvent | React.KeyboardEvent, index: number): void => {
    setIsModalOpen(current => !current);
    setSelectedErrorMsgIndex(index);

    if (event) event.preventDefault();
  };

  const toggleModalOnKeyDown = (event: React.KeyboardEvent, index: number): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleModalOnClick(event, index);
    } else {
      event.preventDefault();
    }
  };

  const { errorMessages, removeErrorMessage, intl } = props;
  const errorMessagesWithId = useMemo(
    () => errorMessages.map(error => ({ ...error, id: uuidv4() })),
    [errorMessages.length],
  );

  if (errorMessagesWithId.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {errorMessagesWithId.map((message, index) => (
        <HGrid gap="1" columns={{ xs: '11fr 1fr' }} key={message.id}>
          <Detail className={styles.wordWrap}>{`${decodeHtmlEntity(message.message)} `}</Detail>
          {message.additionalInfo && (
            <Detail>
              <a
                href=""
                onClick={event => toggleModalOnClick(event, index)}
                onKeyDown={event => toggleModalOnKeyDown(event, index)}
                className={styles.link}
                data-testid="errorDetailsLink"
              >
                <FormattedMessage id="ErrorMessagePanel.ErrorDetails" />
              </a>
            </Detail>
          )}
        </HGrid>
      ))}
      <div className={styles.lukkContainer}>
        <Button
          variant="secondary"
          icon={<XMarkIcon title={intl.formatMessage({ id: 'ErrorMessagePanel.Close' })} />}
          onClick={removeErrorMessage}
          size="small"
          className={styles.closeButton}
        />
      </div>
      {isModalOpen && (
        <ErrorMessageDetailsModal
          showModal={isModalOpen}
          closeModalFn={toggleModalOnClick as () => void}
          errorDetails={errorMessagesWithId[selectedErrorMsgIndex].additionalInfo}
        />
      )}
    </div>
  );
};

export default injectIntl(ErrorMessagePanel);
