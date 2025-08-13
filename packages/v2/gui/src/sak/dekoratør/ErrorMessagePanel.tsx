import { XMarkIcon } from '@navikt/aksel-icons';
import { Button, Detail, HStack } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';
import type { Feilmelding } from './feilmeldingTsType';

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
export const ErrorMessagePanel = (props: OwnProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedErrorMsgIndex, setSelectedErrorMsgIndex] = useState<number>(0);

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

  const { errorMessages, removeErrorMessage } = props;
  const errorMessagesWithId = useMemo(() => errorMessages.map(error => ({ ...error, id: uuidv4() })), [errorMessages]);

  if (errorMessagesWithId.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {errorMessagesWithId.map((message, index) => (
        <HStack gap="space-12" key={message.id}>
          <Detail className={styles.wordWrap}>{`${message.message} `}</Detail>
          {message.additionalInfo && (
            <Detail>
              <button
                onClick={event => toggleModalOnClick(event, index)}
                onKeyDown={event => toggleModalOnKeyDown(event, index)}
                className={styles.link}
                data-testid="errorDetailsLink"
              >
                Detaljert informasjon
              </button>
            </Detail>
          )}
        </HStack>
      ))}
      <div className={styles.lukkContainer}>
        <Button
          variant="tertiary"
          icon={<XMarkIcon title="Lukk" color="white" />}
          onClick={removeErrorMessage}
          size="small"
        />
      </div>
      {isModalOpen && (
        <ErrorMessageDetailsModal
          showModal={isModalOpen}
          closeModalFn={toggleModalOnClick as () => void}
          errorDetails={errorMessagesWithId[selectedErrorMsgIndex]?.additionalInfo}
        />
      )}
    </div>
  );
};

export default ErrorMessagePanel;
