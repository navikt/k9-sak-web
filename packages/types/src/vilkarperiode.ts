import Kodeverk from './kodeverkTsType';

type Vilkarperiode = Readonly<{
  avslagKode: string;
  merknadParametere: { [name: string]: string };
  periode: { fom: string; tom: string };
  vilkarStatus: Kodeverk;
}>;

export default Vilkarperiode;
