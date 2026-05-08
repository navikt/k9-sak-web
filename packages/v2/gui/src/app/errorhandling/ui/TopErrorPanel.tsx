import { BodyLong, Button, GlobalAlert, Link, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { isErrorWithAlertInfo, makeErrorId } from '../AlertInfo.js';

import css from './handCursor.module.css';
import { useGlobalUnhandledErrors } from '../GlobalUnhandledErrorCatcher.js';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import { ErrorModal } from './ErrorModal.js';
import { AdditionalInfoError } from '../AdditionalInfoError.js';

interface TopErrorPanelUIProps {
  readonly errors: ReadonlyArray<Error>;
}

/** Eksponert her kun for testing/storybook. Bruk TopErrorPanel direkte i app */
export const TopErrorPanelUI = ({ errors }: TopErrorPanelUIProps) => {
  const [hidden, setHidden] = useState(false);
  const [displayAdditionalInfoError, setDisplayAdditionalInfoError] = useState<AdditionalInfoError | undefined>();

  if (errors.length > 0) {
    const headerTxt = errors.length > 1 ? `${errors.length} Uventede feil` : `Uventet feil`;
    return (
      <>
        <ErrorModal error={displayAdditionalInfoError} onClose={() => setDisplayAdditionalInfoError(undefined)} />
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
            <ErrorHandlingWizard reportErrors={errors}>
              <VStack gap="space-8">
                {errors.map(error => {
                  const errorId = isErrorWithAlertInfo(error) ? error.errorId : makeErrorId();
                  return (
                    <ErrorHandlingWizard.ErrorBox key={errorId}>
                      <VStack>
                        <BodyLong>{error.message}</BodyLong>
                        {error instanceof AdditionalInfoError ? (
                          <small>
                            <Link className={css.handCursor} onClick={() => setDisplayAdditionalInfoError(error)}>
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
  return <TopErrorPanelUI errors={globalErrors} />;
};
