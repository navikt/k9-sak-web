import type { ErrorBoundaryFallbackProps } from './ErrorBoundary.js';
import { BodyLong, Heading, HStack, Link, VStack } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { sentryReportedErrorIdLookup } from '../sentry.js';
import { isAlertInfo } from '../AlertInfo.js';

export const CrashErrorView = ({ error }: ErrorBoundaryFallbackProps) => {
  let sentryId = '';
  try {
    sentryId = sentryReportedErrorIdLookup.get(error) ?? '';
  } catch {
    // Do nothing
  }
  return (
    <HStack
      justify="center"
      align="center"
      gap="space-16"
      marginBlock={{ xs: 'space-16', lg: 'space-96' }}
      marginInline={{ xs: 'space-8', lg: 'space-16' }}
    >
      <VStack gap="space-8">
        <HStack align="center">
          <XMarkOctagonIcon fontSize="3rem" style={{ color: 'var(--ax-text-danger-subtle)' }} />
          <Heading size="large"> Uventet mange feil oppsto</Heading>
        </HStack>
        <BodyLong>Det oppsto for mange feil uten ny innlasting av systemet.</BodyLong>
        <BodyLong>Dette kan tyde på en ukontrollert gjentagende feilsituasjon.</BodyLong>
        <BodyLong>
          Siste feil som oppsto ({error.name}, id:{isAlertInfo(error) ? error.errorId : ''}, sentry:{sentryId}):
        </BodyLong>
        <BodyLong>{error.message}</BodyLong>
        <BodyLong>
          <Link href="/">Gå til startsiden</Link> for å prøve på nytt, eller rapporter informasjonen over i porten.
        </BodyLong>
      </VStack>
    </HStack>
  );
};
