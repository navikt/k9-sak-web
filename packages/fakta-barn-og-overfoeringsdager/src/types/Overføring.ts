import stringEnum from '@k9-sak-web/types/src/tsUtils';
import Informasjonskilde from '../dto/Informasjonskilde';

export const OverføringstypeEnum = stringEnum({
  OVERFØRING: 'overføring',
  FORDELING: 'fordeling',
  KORONAOVERFØRING: 'koronaoverføring',
});
export type Overføringstype = typeof OverføringstypeEnum[keyof typeof OverføringstypeEnum];

export const OverføringsretningEnum = stringEnum({
  INN: 'inn',
  UT: 'ut',
});
export type Overføringsretning = typeof OverføringsretningEnum[keyof typeof OverføringsretningEnum];

interface Overføring {
  antallDager?: number;
  mottakerAvsenderFnr?: string;
  kilde: Informasjonskilde;
  fom?: string;
  tom?: string;
}

export default Overføring;
