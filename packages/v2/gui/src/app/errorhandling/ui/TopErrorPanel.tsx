import { Button, GlobalAlert, VStack } from '@navikt/ds-react';
import { ErrorMessage } from './ErrorMessage.js';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { resolveErrorUiData } from './resolveErrorUiData.js';
import { makeErrorId } from '../AlertInfo.js';

import css from './handCursor.module.css';
import { useGlobalUnhandledErrors } from '../GlobalUnhandledErrorCatcher.js';
import { ErrorHandlingWizard, ErrorContentBox } from './ErrorHandlingWizard.js';

interface TopErrorPanelUIProps {
  readonly errors: ReadonlyArray<Error>;
}

/** Eksponert her kun for testing/storybook. Bruk TopErrorPanel direkte i app */
export const TopErrorPanelUI = ({ errors }: TopErrorPanelUIProps) => {
  const [hidden, setHidden] = useState(false);

  if (errors.length > 0) {
    const headerTxt = errors.length > 1 ? `${errors.length} Uventede feil` : `Uventet feil`;
    return (
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
              {errors.map(error => {
                const { errorId } = resolveErrorUiData(error);
                return (
                  <ErrorContentBox key={errorId ?? makeErrorId()}>
                    <ErrorMessage error={error} />
                  </ErrorContentBox>
                );
              })}
            </VStack>
          </ErrorHandlingWizard>
        </GlobalAlert.Content>
      </GlobalAlert>
    );
  } else {
    return undefined;
  }
};

export const TopErrorPanel = () => {
  const { globalErrors } = useGlobalUnhandledErrors();
  return <TopErrorPanelUI errors={globalErrors} />;
};
