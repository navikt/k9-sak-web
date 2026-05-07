import { Link, VStack } from '@navikt/ds-react';
import { resolveErrorUiData } from './resolveErrorUiData.js';
import { useState } from 'react';
import { ErrorModal, type ErrorModalProps } from './ErrorModal.js';

import css from './handCursor.module.css';

export interface ErrorMessageProps {
  readonly error: Error;
  readonly onTryAgain?: ErrorModalProps['onTryAgain'];
}

export const ErrorMessage = ({ error, onTryAgain }: ErrorMessageProps) => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const { additionalInfo } = resolveErrorUiData(error);
  return (
    <VStack>
      <div>{error.message}</div>
      {additionalInfo != null ? (
        <>
          <ErrorModal
            error={showAdditionalInfo ? error : undefined}
            onClose={() => setShowAdditionalInfo(false)}
            onTryAgain={onTryAgain}
          />
          <small>
            <Link className={css.handCursor} onClick={() => setShowAdditionalInfo(true)}>
              Vis ekstra info
            </Link>
          </small>
        </>
      ) : null}
    </VStack>
  );
};
