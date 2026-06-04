import { Button, GlobalAlert } from '@navikt/ds-react';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

import css from './handCursor.module.css';
import { useGlobalUnhandledErrors } from '../GlobalUnhandledErrorCatcher.js';
import { ErrorHandlingWizard } from './ErrorHandlingWizard2.js';
import { type ErrorViewProps, resolveErrorViewProps } from './resolveErrorViewProps.js';
import { ErrorModal } from './ErrorModal.js';

interface TopErrorPanelUIProps {
  readonly errors: ReadonlyArray<Error>;
  readonly defaultExpanded?: boolean;
}

/** Eksponert her kun for testing/storybook. Bruk TopErrorPanel direkte i app */
export const TopErrorPanelUI2 = ({ errors, defaultExpanded = false }: TopErrorPanelUIProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selectedError, setSelectedError] = useState<ErrorViewProps | null>(null);

  if (errors.length > 0) {
    const headerTxt = errors.length > 1 ? `${errors.length} Uventede feil` : `Uventet feil`;
    return (
      <>
        <GlobalAlert status="error" centered={false} size="small">
          <GlobalAlert.Header onClick={() => setExpanded(prev => !prev)} className={css.handCursor}>
            <GlobalAlert.Title>{headerTxt}</GlobalAlert.Title>
            {/* GlobalAlert.CloseButton er kopiert ut her for å kunne tilpasse ikon etc */}
            <Button
              data-color="neutral"
              variant="tertiary-neutral"
              className="aksel-base-alert__close-button"
              size="small"
              icon={expanded ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
              iconPosition="right"
              onClick={ev => {
                ev.stopPropagation();
                setExpanded(prev => !prev);
              }}
            >
              {expanded ? 'Minimer' : 'Utvid'}
            </Button>
          </GlobalAlert.Header>
          <GlobalAlert.Content hidden={!expanded}>
            <ErrorHandlingWizard errorProps={errors.map(resolveErrorViewProps)}>
            </ErrorHandlingWizard>
          </GlobalAlert.Content>
        </GlobalAlert>
        <ErrorModal errorProps={selectedError ?? undefined} onClose={() => setSelectedError(null)} />
      </>
    );
  } else {
    return undefined;
  }
};

export const TopErrorPanel2 = () => {
  const { globalErrors } = useGlobalUnhandledErrors();
  return <TopErrorPanelUI2 errors={globalErrors} />;
};
