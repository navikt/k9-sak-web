import { Link, VStack } from '@navikt/ds-react';
import { resolveErrorUiData } from './resolveErrorUiData.js';
import { useState } from 'react';
import { ErrorModal, type ErrorModalProps } from './ErrorModal.js';

import css from './handCursor.module.css';

export interface ErrorMessageProps {
  readonly error: Error;
  readonly onReload: ErrorModalProps['onReload'];
}

export const ErrorMessage = ({ error, onReload }: ErrorMessageProps) => {
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
            onReload={onReload}
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
