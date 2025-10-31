import { createContext } from 'react';
import { MedisinskVilkårApi } from './MedisinskVilkårApi';

export const MedisinskVilkårApiContext = createContext<MedisinskVilkårApi | null>(null);
