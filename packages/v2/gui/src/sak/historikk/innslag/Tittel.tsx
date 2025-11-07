import type { ReactNode } from 'react';
import { Heading } from '@navikt/ds-react';

export const Tittel = ({ children }: { children: ReactNode }) => <Heading size="xsmall">{children}</Heading>;
