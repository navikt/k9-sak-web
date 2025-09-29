import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Heading, HStack, Link, VStack } from '@navikt/ds-react';

export interface BigErrorProps {
  readonly title?: string;
  readonly children?: string | React.ReactNode;
}

export const DefaultErrorMsg = () => (
  <p>
    Forsøk gjerne å{' '}
    <Link inlineText href="#" onClick={() => window.location.reload()}>
      laste siden på nytt{' '}
    </Link>
    . Meld fra i porten hvis problemet vedvarer.
  </p>
);

export const BigError = ({ title = 'Uventet feil', children = <DefaultErrorMsg /> }: BigErrorProps) => {
  return (
    <HStack justify="center" align="center" gap="space-16" marginBlock="24">
      <XMarkOctagonIcon fontSize="4rem" style={{ color: 'var(--ax-text-danger-subtle)' }} />
      <VStack>
        {title && <Heading size="large">{title}</Heading>}
        {children && <div>{children}</div>}
      </VStack>
    </HStack>
  );
};
