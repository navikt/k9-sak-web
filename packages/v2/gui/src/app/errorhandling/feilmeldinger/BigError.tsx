import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Heading, HStack, VStack } from '@navikt/ds-react';

export interface BigErrorProps {
  readonly title: string;
  readonly children: React.ReactNode;
}

export const BigError = ({ title, children }: BigErrorProps) => {
  return (
    <HStack justify="center" align="center" gap="space-16" marginBlock="space-96">
      <XMarkOctagonIcon fontSize="4rem" style={{ color: 'var(--ax-text-danger-subtle)' }} />
      <VStack>
        <Heading size="large">{title}</Heading>
        <div>{children}</div>
      </VStack>
    </HStack>
  );
};
