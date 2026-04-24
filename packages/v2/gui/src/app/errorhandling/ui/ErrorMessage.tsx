import { HStack, InlineMessage, Link, VStack } from '@navikt/ds-react';
import { ErrorReference } from './ErrorReference.js';
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
  const { errorRef, additionalInfo } = resolveErrorUiData(error);
  return (
    <InlineMessage status="error" size="small" style={{ alignItems: 'center' }}>
      <VStack>
        <div>{error.message}</div>
        <HStack gap="space-16">
          {errorRef != null ? (
            <small>
              <ErrorReference ref={errorRef} />
            </small>
          ) : null}
          {error.name != 'Error' ? <small>({error.name})</small> : null}
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
        </HStack>
      </VStack>
    </InlineMessage>
  );
};
