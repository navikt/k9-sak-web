import { Heading, HStack, VStack } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';

export interface BigErrorProps {
  readonly title?: string;
  readonly children?: string | React.ReactNode;
}

const DefaultChildren = () => (
  <>
    Forøk gjerne å <a href="javascript: window.location.reload()">laste siden på nytt</a>, eller meld fra i porten hvis
    problemet vedvarer.
  </>
);

export const BigError = ({ title = 'Uventet feil', children = <DefaultChildren /> }: BigErrorProps) => {
  return (
    <HStack justify="center" align="center" gap="4" marginBlock="24">
      <XMarkOctagonIcon fontSize="4rem" style={{ color: 'var(--a-text-danger)' }} />
      <VStack gap={{ xs: '1', md: '2' }}>
        {title && <Heading size="large">{title}</Heading>}
        {children && <div>{children}</div>}
      </VStack>
    </HStack>
  );
};
