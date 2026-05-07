import { BigError, DefaultErrorMsg } from './BigError.js';
import { CopyButton } from '@navikt/ds-react';

export interface NetworkErrorPageProps {
  readonly navCallId?: string;
  readonly statusCode?: number;
}

const NetworkErrorPage = ({ navCallId, statusCode = 0 }: NetworkErrorPageProps) => {
  return (
    <BigError title="Feil ved henting/sending av data">
      <DefaultErrorMsg />
      {navCallId != null ? (
        <p>
          Inkluder referanse{' '}
          <b>
            {navCallId} ({statusCode})
          </b>
          <CopyButton size="xsmall" copyText={`${navCallId} (${statusCode})`} style={{ display: 'inline-grid' }} /> hvis
          du melder feilen inn.
        </p>
      ) : null}
    </BigError>
  );
};

export default NetworkErrorPage;
