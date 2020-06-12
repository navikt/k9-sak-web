import { createContext } from 'react';
import { Kodeverk } from '@k9-sak-web/types';

type ContextProps = {
  fagsakYtelseType?: Kodeverk;
};

// eslint-disable-next-line
export const BeregningContext = createContext<Partial<ContextProps>>({});
