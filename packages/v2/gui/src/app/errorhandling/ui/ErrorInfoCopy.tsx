import { type ErrorAndId } from '../AlertInfo.js';
import { Button } from '@navikt/ds-react';
import { type ComponentProps, useCallback } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import { makeErrorReportText } from './makeErrorReportText.js';

export type ErrorInfoCopyProps = Omit<ComponentProps<typeof Button>, 'onClick'> &
  Readonly<{ errorAndIds: ReadonlyArray<ErrorAndId>; onCopied?: () => void }>;

export const ErrorInfoCopy = ({ errorAndIds, onCopied, ...btnProps }: ErrorInfoCopyProps) => {
  const copyText = makeErrorReportText(errorAndIds);
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
