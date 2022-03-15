import Kodeverk from './kodeverkTsType';

export type Behandlingsresultat = Readonly<{
  type: Kodeverk; // Denne skal forbli kodeverk, grunnet ekstra flagg bakt inn i kode/kodeverk objektet fra backend
  fritekstbrev?: string;
  overskrift?: string;
  vedtaksbrev?: string;
  avslagsarsak?: string;
  avslagsarsakFritekst?: string;
  konsekvenserForYtelsen?: string[];
}>;

export default Behandlingsresultat;
