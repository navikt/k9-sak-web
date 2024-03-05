import Kodeverk from './kodeverkTsType';

export type Behandlingsresultat = Readonly<{
  type: string;
  fritekstbrev?: string;
  overskrift?: string;
  vedtaksbrev?: string;
  avslagsarsak?: string;
  avslagsarsakFritekst?: string;
  konsekvenserForYtelsen?: string[];
}>;

export default Behandlingsresultat;
