import { CopyButton } from '@navikt/ds-react';

export interface NavCallIdEncouragementMsgProps {
  readonly navCallId?: string | null;
  readonly statusCode?: number;
}

export const NavCallIdEncouragementMsg = ({ navCallId, statusCode = 0 }: NavCallIdEncouragementMsgProps) =>
  navCallId !== undefined && navCallId !== null ? (
    <>
      Inkluder referanse{' '}
      <b>
        {navCallId} ({statusCode})
      </b>
      <CopyButton size="xsmall" copyText={`${navCallId} (${statusCode})`} style={{ display: 'inline-grid' }} /> hvis du
      melder feilen inn.
    </>
  ) : null;
