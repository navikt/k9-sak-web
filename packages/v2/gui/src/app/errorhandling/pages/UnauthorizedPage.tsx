import { BigError } from '../feilmeldinger/BigError.js';
import { Link } from '@navikt/ds-react';
import type { FC } from 'react';
import ErrorBoundary from '../feilmeldinger/ErrorBoundary.js';

interface UnauthorizedPageProps {
  readonly loginUrl: string;
}

export const k9LoginResourcePath = '/k9/sak/resource/login';
export const ungLoginResourcePath = '/ung/sak/resource/login';

/**
 * UnauthorizedPage
 *
 * Visast når bruker ikkje er innlogga.
 */
const UnauthorizedPage: FC<UnauthorizedPageProps> = ({ loginUrl }) => (
  <ErrorBoundary>
    <BigError title="Du må logge inn for å få tilgang til systemet">
      <Link href={loginUrl}>Gå til innloggingssiden</Link>
    </BigError>
  </ErrorBoundary>
);

export default UnauthorizedPage;
