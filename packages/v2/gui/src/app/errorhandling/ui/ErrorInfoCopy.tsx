import { isAlertInfo } from '../alerts/AlertInfo.js';
import { Button } from '@navikt/ds-react';
import { type ComponentProps, useCallback } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';

const prepareCopyText = (errors: ReadonlyArray<Error>): string => {
  const errLines: string[] = [];
  for (const error of errors) {
    const errorId = isAlertInfo(error) ? error.errorId : null;
    const header = `**** ${error.name} (id: ${errorId}) ****`;
    const message = `${error.message}`;
    errLines.push(header, message, '/');
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
      Kopier rapporteringsinfo
    </Button>
  );
};
