import Kodeverk from './kodeverkTsType';

export type Vilkarperiode = Readonly<{
  avslagKode?: string;
  begrunnelse?: string;
  vurdersIBehandlingen?: boolean;
  merknadParametere: { [name: string]: string };
  periode: { fom: string; tom: string };
  vilkarStatus: Kodeverk;
}>;

export default Vilkarperiode;
