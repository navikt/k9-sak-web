import { isAlertInfo } from '../AlertInfo.js';
import { Button } from '@navikt/ds-react';
import { type ComponentProps, useCallback } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { AxiosError } from 'axios';

const prepareCopyText = (errors: ReadonlyArray<Error>): string => {
  const errLines: string[] = [];
  for (const error of errors) {
    const errorId = isAlertInfo(error) ? error.errorId : null;
    errLines.push(`**** ${error.name} (id: ${errorId}) ****`);
    errLines.push(`${error.message}`);
    if (error instanceof ExtendedApiError) {
      errLines.push(`NavCallid:${error.navCallid}`);
    }
    if (error instanceof AxiosError) {
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
  Readonly<{ errors: ReadonlyArray<Error>; onCopied?: () => void }>;

export const ErrorInfoCopy = ({ errors, onCopied, ...btnProps }: ErrorInfoCopyProps) => {
  const copyText = prepareCopyText(errors);
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
