import Kodeverk from './kodeverkTsType';

type Vilkarperiode = Readonly<{
  avslagKode: string;
  begrunnelse?: string;
  merknadParametere: { [name: string]: string };
  periode: { fom: string; tom: string };
  vilkarStatus: Kodeverk;
}>;

export default Vilkarperiode;
