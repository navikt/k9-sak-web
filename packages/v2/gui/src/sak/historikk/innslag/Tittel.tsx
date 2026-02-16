import { Heading } from '@navikt/ds-react';
import type { ReactNode } from 'react';

export const Tittel = ({ children }: { children: ReactNode }) => (
  <Heading level="4" size="xsmall">
    {children}
  </Heading>
);
