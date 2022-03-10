import Kodeverk from './kodeverkTsType';
import Periode from './periodeTsType';

export type Fagsak = Readonly<{
  saksnummer: string;
  sakstype: string;
  relasjonsRolleType: Kodeverk;
  status: string;
  barnFodt: string;
  person: {
    erDod: boolean;
    navn: string;
    alder: number;
    personnummer: string;
    erKvinne: boolean;
    personstatusType: Kodeverk;
    diskresjonskode?: Kodeverk;
    dodsdato?: string;
    aktørId?: string;
  };
  gyldigPeriode?: Periode;
  opprettet: string;
  endret: string;
  antallBarn: number;
  kanRevurderingOpprettes: boolean;
  skalBehandlesAvInfotrygd: boolean;
  dekningsgrad: number;
}>;

export default Fagsak;
