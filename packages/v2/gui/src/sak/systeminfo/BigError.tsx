import { Heading, HStack, VStack } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';

export interface BigErrorProps {
  readonly title?: string;
  readonly children: string | React.ReactNode;
}

export const BigError = ({ title, children }: BigErrorProps) => (
  <HStack justify="center" align="center" gap="4">
    <XMarkOctagonIcon fontSize="4rem" style={{ color: 'var(--a-text-danger)' }} />
    <VStack gap={{ xs: '1', md: '2' }}>
      {title && <Heading size="large">{title}</Heading>}
      <div>{children}</div>
    </VStack>
  </HStack>
);
