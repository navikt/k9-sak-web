import Kodeverk from './kodeverkTsType';

export type Vilkarperiode = Readonly<{
  avslagKode?: string;
  begrunnelse?: string;
  vurdersIBehandlingen?: boolean;
  vurderesIBehandlingen?: boolean;
  merknad?: Kodeverk;
  merknadParametere: { [name: string]: string };
  periode: { fom: string; tom: string };
  vilkarStatus: Kodeverk;
}>;

export default Vilkarperiode;
