import { BigError, DefaultErrorMsg } from '@k9-sak-web/gui/sak/feilmeldinger/BigError.js';
import { CopyButton } from '@navikt/ds-react';

export interface NetworkErrorPageProps {
  readonly navCallId?: string;
  readonly statusCode?: number;
}

const NetworkErrorPage = ({ navCallId, statusCode = 0 }: NetworkErrorPageProps) => {
  const NavCallId = () =>
    navCallId !== undefined || statusCode !== undefined ? (
      <p>
        Inkluder referanse{' '}
        <b>
          {navCallId} ({statusCode})
        </b>
        <CopyButton size="xsmall" copyText={`${navCallId} (${statusCode})`} style={{ display: 'inline-grid' }} /> hvis
        du melder feilen inn.
      </p>
    ) : null;
  return (
    <BigError title="Feil ved henting/sending av data">
      <DefaultErrorMsg />
      <NavCallId />
    </BigError>
  );
};

export default NetworkErrorPage;
