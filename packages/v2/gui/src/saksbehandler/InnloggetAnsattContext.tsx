import type { InnloggetAnsattDto } from '@k9-sak-web/backend/combined/sif/abac/kontrakt/abac/InnloggetAnsattDto.js';
import { createContext } from 'react';

export const InnloggetAnsattContext = createContext<InnloggetAnsattDto>({});
