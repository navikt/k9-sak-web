import { BigError, DefaultErrorMsg } from './BigError.js';
import { CopyButton } from '@navikt/ds-react';

export interface ErrorPageProps {
  readonly sentryId?: string;
  readonly errorMessage?: string;
}

const ErrorPage = ({ sentryId, errorMessage }: ErrorPageProps) => {
  const SentryRef = () =>
    sentryId !== undefined ? (
      <p>
        Inkluder referanse <b>{sentryId}</b>{' '}
        <CopyButton size="xsmall" copyText={`Sentry referanse: ${sentryId}`} style={{ display: 'inline-grid' }} /> hvis
        du melder feilen inn.
      </p>
    ) : null;
  return (
    <BigError title="Det har oppstått en teknisk feil i denne behandlingen.">
      <p>{errorMessage}</p>
      <DefaultErrorMsg />
      <SentryRef />
    </BigError>
  );
};

export default ErrorPage;
