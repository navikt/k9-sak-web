import { Button, GlobalAlert, Link, VStack } from '@navikt/ds-react';
import { ErrorMessage } from './ErrorMessage.js';
import { useState } from 'react';
import { ChevronDownDoubleIcon, ChevronUpDoubleIcon } from '@navikt/aksel-icons';
import { resolveErrorUiData } from './resolveErrorUiData.js';
import { makeErrorId } from '../alerts/AlertInfo.js';

import css from './handCursor.module.css';
import { SentryReportedError } from '../SentryReportedError.js';
import { useGlobalUnhandledErrors } from '../GlobalUnhandledErrorCatcher.js';

interface TopErrorPanelUIProps {
  readonly errors: ReadonlyArray<Error>;
}

const resolveErrorNames = (errors: ReadonlyArray<Error>): string[] => {
  const names = new Set(errors.map(e => (e instanceof SentryReportedError ? e.reported.name : e.name)));
  // Vi ønsker maks tre unike navn returnert
  const max3 = Array.from(names).slice(0, 3);
  if (names.size > 3) {
    return [...max3, '…']; // Legg til ellipsis for å signalisere at lista vart kutta
  }
  return max3;
};

/** Eksponert her kun for testing/storybook. Bruk TopErrorPanel direkte i app */
export const TopErrorPanelUI = ({ errors }: TopErrorPanelUIProps) => {
  const [hidden, setHidden] = useState(false);
  const reload = () => window.location.reload();

  if (errors.length > 0) {
    const errorNames = resolveErrorNames(errors);
    const headerTxt = errors.length > 1 ? `${errors.length} Uventede feil` : `Uventet feil`;
    return (
      <GlobalAlert status="error" centered={false} size="small">
        <GlobalAlert.Header onClick={() => setHidden(prev => !prev)} className={css.handCursor}>
          <GlobalAlert.Title>
            {headerTxt} ({errorNames.join(', ')})
          </GlobalAlert.Title>
          {/* GlobalAlert.CloseButton er kopiert ut her for å kunne tilpasse ikon etc */}
          <Button
            data-color="neutral"
            variant="tertiary-neutral"
            className="aksel-base-alert__close-button"
            size="small"
            title={hidden ? 'Utvid' : 'Minimer'}
            icon={hidden ? <ChevronDownDoubleIcon aria-hidden /> : <ChevronUpDoubleIcon aria-hidden />}
            onClick={ev => {
              ev.stopPropagation();
              setHidden(prev => !prev);
            }}
          />
        </GlobalAlert.Header>
        <GlobalAlert.Content hidden={hidden}>
          {headerTxt} oppsto. Dette kan bety at skjermbildet ikke viser korrekt tilstand. Du bør{' '}
          <Link inlineText href="#" onClick={reload}>
            laste inn på nytt
          </Link>{' '}
          hvis du er usikker.
          <VStack gap="space-16" marginBlock="space-16 space-0">
            {errors.map(error => {
              const { errorId } = resolveErrorUiData(error);
              return <ErrorMessage error={error} onReload={reload} key={errorId ?? makeErrorId()} />;
            })}
          </VStack>
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
