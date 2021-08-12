import Behandlingsresultat from './behandlingsresultat';

export type Behandling = Readonly<{
  id: number;
  versjon: number;
  behandlingsresultat: Behandlingsresultat;
}>;

export default Behandling;
