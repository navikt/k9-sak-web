import { type ErrorAndId } from '../AlertInfo.js';
import { Button } from '@navikt/ds-react';
import { type ComponentProps, useCallback } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { ExtendedAxiosError } from '../ExtendedAxiosError.js';
import { sentryReportedErrorIdLookup } from '../sentry.js';

const prepareCopyText = (errorAndIds: ReadonlyArray<ErrorAndId>): string => {
  const errLines: string[] = [];
  for (const { error, errorId } of errorAndIds) {
    const sentryId = `sentry:${sentryReportedErrorIdLookup.get(error)}`;
    errLines.push(`**** ${error.name} (id:${errorId}, ${sentryId}) ****`);
    errLines.push(`${error.message}`);
    if (error instanceof ExtendedApiError) {
      errLines.push(`NavCallid:${error.navCallid}`);
    }
    if (error instanceof ExtendedAxiosError) {
      const callId = error.config?.headers.get('Nav-Callid');
      if (typeof callId === 'string') {
        errLines.push(`NavCallid:${callId}`);
      }
    }
    errLines.push('/');
  }
  return errLines.join('\n');
};

export type ErrorInfoCopyProps = Omit<ComponentProps<typeof Button>, 'onClick'> &
  Readonly<{ errorAndIds: ReadonlyArray<ErrorAndId>; onCopied?: () => void }>;

export const ErrorInfoCopy = ({ errorAndIds, onCopied, ...btnProps }: ErrorInfoCopyProps) => {
  const copyText = prepareCopyText(errorAndIds);
  const copyAction = useCallback(async () => {
    await navigator.clipboard.writeText(copyText);
    onCopied?.();
  }, [copyText, onCopied]);

  return (
    <Button {...btnProps} onClick={copyAction} icon={<FilesIcon />} iconPosition="right">
      Kopier feilinformasjon
    </Button>
  );
};
