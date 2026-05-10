import { BodyLong, Button, GlobalAlert, Link, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { isAlertInfo } from '../AlertInfo.js';

import css from './handCursor.module.css';
import { useGlobalUnhandledErrors } from '../GlobalUnhandledErrorCatcher.js';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import { ErrorModal } from './ErrorModal.js';
import { AdditionalInfoError } from '../legacycompat/AdditionalInfoError.js';

interface TopErrorPanelUIProps {
  readonly errors: ReadonlyArray<Error>;
}

const isAdditionalInfoError = (error: Error): error is AdditionalInfoError => error instanceof AdditionalInfoError;

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
            <ErrorHandlingWizard errors={errors}>
              <VStack gap="space-8">
                {errors.map((error, index) => {
                  const key = isAlertInfo(error) ? error.errorId : index;
                  return (
                    <ErrorHandlingWizard.ErrorBox key={key}>
                      <VStack>
                        <BodyLong>{error.message}</BodyLong>
                        {isAdditionalInfoError(error) ? (
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
