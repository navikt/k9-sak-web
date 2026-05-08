import type { ErrorBoundaryFallbackProps } from './ErrorBoundary.js';
import { BodyLong, Heading, HStack, Link, VStack } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { isAlertInfo } from '../AlertInfo.js';

export const CrashErrorView = ({ error, sentryId }: ErrorBoundaryFallbackProps) => {
  let errorId = 'Ingen';
  try {
    errorId = isAlertInfo(error) ? `${error.errorId}` : errorId;
  } catch (e) {
    console.warn('Feil ved utleding av errorId:', e);
    // Fortsetter uten errorId
  }
  return (
    <HStack justify="center" align="center" gap="space-16" marginBlock="space-96">
      <XMarkOctagonIcon fontSize="4rem" style={{ color: 'var(--ax-text-danger-subtle)' }} />
      <VStack gap="space-8">
        <Heading size="large">Uventet mange feil oppsto</Heading>
        <BodyLong>Det oppsto for mange feil uten ny innlasting av systemet.</BodyLong>
        <BodyLong>Dette kan tyde på en ukontrollert gjentagende feilsituasjon.</BodyLong>
        <BodyLong>
          Siste feil som oppsto ({error.name}, id:{errorId}, sentry:{sentryId}):
        </BodyLong>
        <BodyLong>{error.message}</BodyLong>
        <BodyLong>
          <Link href="/">Gå til startsiden</Link> for å prøve på nytt, eller rapporter informasjonen over i porten.
        </BodyLong>
      </VStack>
    </HStack>
  );
};
