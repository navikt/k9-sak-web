import { createContext } from 'react';
import type { InnloggetAnsattDto } from '@k9-sak-web/backend/combined/sif/abac/kontrakt/abac/InnloggetAnsattDto.js';

export const InnloggetAnsattContext = createContext<InnloggetAnsattDto>({});
