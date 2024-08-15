import { Heading, HStack, VStack } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';

export interface BigErrorProps {
  readonly title?: string;
  readonly children?: string | React.ReactNode;
}

export const DefaultErrorMsg = () => (
  <p>
    Forsøk gjerne å{' '}
    <a href="#" onClick={() => window.location.reload()}>
      laste siden på nytt{' '}
    </a>
    . Meld fra i porten hvis problemet vedvarer.
  </p>
);

export const BigError = ({ title = 'Uventet feil', children = <DefaultErrorMsg /> }: BigErrorProps) => {
  return (
    <HStack justify="center" align="center" gap="4" marginBlock="24">
      <XMarkOctagonIcon fontSize="4rem" style={{ color: 'var(--a-text-danger)' }} />
      <VStack>
        {title && <Heading size="large">{title}</Heading>}
        {children && <div>{children}</div>}
      </VStack>
    </HStack>
  );
};
