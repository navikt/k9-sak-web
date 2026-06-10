import { BodyLong, Button, GlobalAlert, HStack, VStack } from '@navikt/ds-react';
import { type FC, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ExpandIcon } from '@navikt/aksel-icons';

import css from './handCursor.module.css';
import { useGlobalUnhandledErrors } from '../GlobalUnhandledErrorCatcher.js';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import { resolveErrorViewProps, type ErrorViewProps } from './resolveErrorViewProps.js';
import { ErrorModal } from './ErrorModal.js';

interface TopErrorPanelUIProps {
  readonly errors: ReadonlyArray<Error>;
  readonly aktivFagsakId?: string;
  readonly defaultExpanded?: boolean;
}

/** Eksponert her kun for testing/storybook. Bruk TopErrorPanel direkte i app */
export const TopErrorPanelUI = ({ errors, aktivFagsakId, defaultExpanded = false }: TopErrorPanelUIProps) => {
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
            <ErrorHandlingWizard errors={errors} aktivFagsakId={aktivFagsakId}>
              <VStack gap="space-8">
                {errors.map((error, index) => {
                  const errorProps = resolveErrorViewProps(error);
                  return (
                    <ErrorHandlingWizard.ErrorBox key={index}>
                      <HStack gap="space-8" align="center" justify="space-between">
                        <BodyLong>{errorProps.title}</BodyLong>
                        <Button
                          size="small"
                          variant="tertiary-neutral"
                          data-color="neutral"
                          icon={<ExpandIcon aria-hidden />}
                          iconPosition="right"
                          onClick={() => setSelectedError(errorProps)}
                        >
                          Detaljer
                        </Button>
                      </HStack>
                    </ErrorHandlingWizard.ErrorBox>
                  );
                })}
              </VStack>
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

export const TopErrorPanel: FC<Pick<TopErrorPanelUIProps, 'aktivFagsakId'>> = ({aktivFagsakId}) => {
  const { globalErrors } = useGlobalUnhandledErrors();
  return <TopErrorPanelUI errors={globalErrors} aktivFagsakId={aktivFagsakId} />;
};
