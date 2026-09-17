import { HStack, LocalAlert, Spacer, VStack } from '@navikt/ds-react';
import type { ErrorViewProps } from './resolveErrorViewProps.js';
import { FixButton } from './FixButton.js';
import { ErrorReportButton } from './ErrorReportButton.js';
import { ErrorReportPopover } from './ErrorReportPopover.js';
import { makeErrorReportLinkForJira } from './makeErrorReportText.js';
import { ErrorPanel } from './ErrorPanel.js';

export type ErrorAlertProps = ErrorViewProps;

export const ErrorAlert = ({ error, title, errorInfo, fixAction }: ErrorAlertProps) => {
  const reportLink = makeErrorReportLinkForJira([error]);
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        <VStack gap="space-8">
          <ErrorPanel errorInfo={errorInfo} fixAction={fixAction} />
          <HStack gap="space-4" align="center">
            <FixButton fixAction={fixAction} />
            <ErrorReportButton reportLink={reportLink} />
            <Spacer />
            <ErrorReportPopover errors={[error]} />
          </HStack>
        </VStack>
      </LocalAlert.Content>
    </LocalAlert>
  );
};
