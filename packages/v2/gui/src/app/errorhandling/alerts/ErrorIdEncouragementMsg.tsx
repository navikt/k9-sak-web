import { CopyButton } from '@navikt/ds-react';

export const ErrorIdEncouragementMsg = ({
  errorId,
  errorName,
}: {
  readonly errorId: number;
  readonly errorName?: string;
}) => {
  const maybeErrorName = errorName !== undefined ? `(${errorName})` : '';
  return (
    <>
      Inkluder referanse{' '}
      <b>
        {errorId} {maybeErrorName}
      </b>
      <CopyButton size="xsmall" copyText={`errorId: ${errorId} ${maybeErrorName}`} style={{ display: 'inline-grid' }} />{' '}
      hvis du melder feilen inn.
    </>
  );
};
