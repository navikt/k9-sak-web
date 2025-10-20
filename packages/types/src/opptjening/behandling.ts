import Behandlingsresultat from './behandlingsresultat';

type Behandling = Readonly<{
  id: number;
  versjon: number;
  behandlingsresultat: Behandlingsresultat;
}>;

export default Behandling;
