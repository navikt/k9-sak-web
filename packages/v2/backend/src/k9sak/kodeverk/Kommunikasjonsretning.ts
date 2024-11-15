import {
  type kommunikasjonsretning as GeneratedKommunikasjonsretningEnumUnion,
  kommunikasjonsretning as generatedKommunikasjonsretning,
} from '../generated';

export type Kommunikasjonsretning = GeneratedKommunikasjonsretningEnumUnion;

export type KommunikasjonsretningName = 'INN' | 'UT' | 'NOTAT';

export const Kommunikasjonsretning: Readonly<Record<KommunikasjonsretningName, Kommunikasjonsretning>> = {
  INN: generatedKommunikasjonsretning.I,
  UT: generatedKommunikasjonsretning.U,
  NOTAT: generatedKommunikasjonsretning.N,
};
