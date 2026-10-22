import type Kodeverk from './kodeverkTsType';
import type Vilkårresultat from './opptjening/vilkårresultat';

export type Behandlingsresultat = Readonly<{
  type: Kodeverk;
  vilkårResultat?: Record<string, Vilkårresultat[]>;
  fritekstbrev?: string;
  overskrift?: string;
  vedtaksbrev?: Kodeverk;
  avslagsarsak?: Kodeverk;
  avslagsarsakFritekst?: string;
  konsekvenserForYtelsen?: Kodeverk[];
}>;

export default Behandlingsresultat;
