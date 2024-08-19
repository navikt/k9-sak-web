import { BigError, DefaultErrorMsg } from '@k9-sak-web/gui/sak/feilmeldinger/BigError.js';
import { CopyButton } from '@navikt/ds-react';

export interface ErrorPageProps {
  readonly sentryId?: string;
}

const ErrorPage = ({ sentryId }: ErrorPageProps) => {
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
      <DefaultErrorMsg />
      <SentryRef />
    </BigError>
  );
};

export default ErrorPage;
