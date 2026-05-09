import { BodyLong, Button, GlobalAlert, Link, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { type ErrorAndId } from '../AlertInfo.js';

import css from './handCursor.module.css';
import { useGlobalUnhandledErrors } from '../GlobalUnhandledErrorCatcher.js';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import { ErrorModal } from './ErrorModal.js';
import { AdditionalInfoError } from '../AdditionalInfoError.js';

interface TopErrorPanelUIProps {
  readonly errorAndIds: ReadonlyArray<ErrorAndId>;
}

const isAdditionalInfoErrorAndId = (errorAndId: ErrorAndId): errorAndId is ErrorAndId<AdditionalInfoError> =>
  errorAndId.error instanceof AdditionalInfoError;

/** Eksponert her kun for testing/storybook. Bruk TopErrorPanel direkte i app */
export const TopErrorPanelUI = ({ errorAndIds }: TopErrorPanelUIProps) => {
  const [hidden, setHidden] = useState(false);
  const [displayAdditionalInfoError, setDisplayAdditionalInfoError] = useState<
    ErrorAndId<AdditionalInfoError> | undefined
  >();

  if (errorAndIds.length > 0) {
    const headerTxt = errorAndIds.length > 1 ? `${errorAndIds.length} Uventede feil` : `Uventet feil`;
    return (
      <>
        <ErrorModal errorAndId={displayAdditionalInfoError} onClose={() => setDisplayAdditionalInfoError(undefined)} />
        <GlobalAlert status="error" centered={false} size="small">
          <GlobalAlert.Header onClick={() => setHidden(prev => !prev)} className={css.handCursor}>
            <GlobalAlert.Title>{headerTxt}</GlobalAlert.Title>
            {/* GlobalAlert.CloseButton er kopiert ut her for å kunne tilpasse ikon etc */}
            <Button
              data-color="neutral"
              variant="tertiary-neutral"
              className="aksel-base-alert__close-button"
              size="small"
              icon={hidden ? <ChevronDownIcon aria-hidden /> : <ChevronUpIcon aria-hidden />}
              iconPosition="right"
              onClick={ev => {
                ev.stopPropagation();
                setHidden(prev => !prev);
              }}
            >
              {hidden ? 'Utvid' : 'Minimer'}
            </Button>
          </GlobalAlert.Header>
          <GlobalAlert.Content hidden={hidden}>
            <ErrorHandlingWizard errorAndIds={errorAndIds}>
              <VStack gap="space-8">
                {errorAndIds.map(errorAndId => {
                  const { error, errorId } = errorAndId;
                  return (
                    <ErrorHandlingWizard.ErrorBox key={errorId}>
                      <VStack>
                        <BodyLong>{error.message}</BodyLong>
                        {isAdditionalInfoErrorAndId(errorAndId) ? (
                          <small>
                            <Link className={css.handCursor} onClick={() => setDisplayAdditionalInfoError(errorAndId)}>
                              Vis ekstra info
                            </Link>
                          </small>
                        ) : null}
                      </VStack>
                    </ErrorHandlingWizard.ErrorBox>
                  );
                })}
              </VStack>
            </ErrorHandlingWizard>
          </GlobalAlert.Content>
        </GlobalAlert>
      </>
    );
  } else {
    return undefined;
  }
};

export const TopErrorPanel = () => {
  const { globalErrors } = useGlobalUnhandledErrors();
  return <TopErrorPanelUI errorAndIds={globalErrors} />;
};
