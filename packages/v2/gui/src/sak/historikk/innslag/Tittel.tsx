import type { ReactNode } from 'react';
import { Heading } from '@navikt/ds-react';

export const Tittel = ({ children }: { children: ReactNode }) => (
  <Heading level="4" size="xsmall">
    {children}
  </Heading>
);
