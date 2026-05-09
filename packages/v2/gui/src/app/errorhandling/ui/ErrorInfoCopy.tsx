import { Button } from '@navikt/ds-react';
import { type ComponentProps, useCallback } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import { makeErrorReportText } from './makeErrorReportText.js';

export type ErrorInfoCopyProps = Omit<ComponentProps<typeof Button>, 'onClick'> &
  Readonly<{ errors: ReadonlyArray<Error>; onCopied?: () => void }>;

export const ErrorInfoCopy = ({ errors, onCopied, ...btnProps }: ErrorInfoCopyProps) => {
  const copyText = makeErrorReportText(errors);
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
