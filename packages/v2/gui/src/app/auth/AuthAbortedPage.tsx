import { Alert, BodyShort, Heading, HStack, Link, VStack } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';

interface AuthAbortedPageProps {
  readonly retryURL: URL | null;
}

export const AuthAbortedPage = ({ retryURL }: AuthAbortedPageProps) => {
  return (
    <HStack justify="center" padding="space-48">
      <VStack justify="center" gap="space-16">
        <HStack align="center">
          <XMarkOctagonIcon fontSize="4rem" style={{ color: 'var(--ax-text-danger-subtle)' }} />
          <Heading size="medium">Innlogging avbrutt</Heading>{' '}
        </HStack>
        <Alert variant="error">Automatisk innlogging ble avbrutt før den var fullført.</Alert>
        <VStack>
          <BodyShort>Mulige årsaker:</BodyShort>
          <ul>
            <li>Du lukket popupvinduet før innlogging var ferdig</li>
            <li>Nettleser blokkerte automatisk åpning av popup vinduet for innlogging</li>
            <li>Teknisk feil i autentiseringsflyt</li>
          </ul>
        </VStack>
        <BodyShort>Hvis du ønsker å logge inn, prøv på nytt med linken under.</BodyShort>
        <BodyShort weight="semibold">
          <Link href={retryURL?.href ?? '/'}>Logg inn</Link>
        </BodyShort>
      </VStack>
    </HStack>
  );
};
