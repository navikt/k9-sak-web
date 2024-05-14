import Periode from './periodeTsType';

export type Fagsak = Readonly<{
  saksnummer: string;
  sakstype: string;
  relasjonsRolleType: string;
  status: string;
  barnFodt: string;
  person: {
    erDod: boolean;
    navn: string;
    alder: number;
    personnummer: string;
    erKvinne: boolean;
    personstatusType: string;
    diskresjonskode?: string;
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
  erPbSak?: boolean;
  pleietrengendeAktørId?: string;
}>;

export default Fagsak;
