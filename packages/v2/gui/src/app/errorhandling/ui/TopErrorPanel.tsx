import { Button, GlobalAlert, HStack, Pagination, Spacer, Tooltip, VStack } from '@navikt/ds-react';
import { type FC, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

import css from './handCursor.module.css';
import { useGlobalUnhandledErrors } from '../GlobalUnhandledErrorCatcher.js';
import { resolveErrorViewProps } from './resolveErrorViewProps.js';
import { makeErrorReportLinkForJira } from "./makeErrorReportText.js";
import { ErrorReportPopover } from "./ErrorReportPopover.js";
import { FixButton } from "./FixButton.js";
import { ErrorReportButton } from "./ErrorReportButton.js";
import { ErrorPanel } from "./ErrorPanel.js";

interface TopErrorPanelUIProps {
  readonly errors: ReadonlyArray<Error>;
  readonly aktivFagsakId?: string;
  readonly defaultExpanded?: boolean;
}

/** Eksponert her kun for testing/storybook. Bruk TopErrorPanel direkte i app */
export const TopErrorPanelUI = ({ errors, aktivFagsakId, defaultExpanded = false }: TopErrorPanelUIProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Side i paginering er 1-basert. Standard er siste side, slik at nyaste feil blir vist først.
  const [page, setPage] = useState(errors.length);

  const currentIndex = Math.min(Math.max(page, 1), errors.length) - 1;
  const currentError = errors[currentIndex];
  if (currentError == null) {
    return null;
  }
  const { title, errorInfo, fixAction } = resolveErrorViewProps(currentError);

  const reportLink = makeErrorReportLinkForJira(errors, aktivFagsakId);

  if (errors.length > 0) {
    const extraHeaderTxt = errors.length > 1 ? `(${currentIndex + 1} av ${errors.length})` : ``;
    return (
      <>
        <GlobalAlert status="error" centered={false} size="small">
          <GlobalAlert.Header onClick={() => setExpanded(prev => !prev)} className={css.handCursor}>
            <GlobalAlert.Title>{title} {extraHeaderTxt}</GlobalAlert.Title>
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
            <VStack gap="space-8">
              <ErrorPanel errorInfo={errorInfo} fixAction={fixAction} />
              <HStack gap="space-4" align="center">
                <FixButton fixAction={fixAction} />
                <ErrorReportButton reportLink={reportLink} />
                <Spacer />
                {errors.length > 1 ? (
                  <Tooltip content="Feilnummer">
                    <Pagination
                      page={page}
                      onPageChange={setPage}
                      count={errors.length}
                      siblingCount={0}
                      boundaryCount={1}
                      size="xsmall"
                      srHeading={{ tag: 'h6', text: 'Bla mellom feil' }}
                    />
                  </Tooltip>
                ) : null}
                <ErrorReportPopover errors={errors} />
              </HStack>
            </VStack>
          </GlobalAlert.Content>
        </GlobalAlert>
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
