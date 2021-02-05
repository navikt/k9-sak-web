import { Fagsak } from '@k9-sak-web/types';
import fagsakPersonTsType from '@k9-sak-web/types/src/fagsakPersonTsType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
// import Kodeverk from "@k9-sak-web/types/src/kodeverkTsType";

// eslint-disable-next-line import/prefer-default-export
export const fagsakMock = {
  saksnummer: '5YC1S',
  sakstype: { kode: 'OMP', kodeverk: 'FAGSAK_YTELSE' },
  //  "gyldigPeriode": {"fom": "2020-01-01", "tom": "2020-12-31"},
  status: { kode: 'LOP', kodeverk: 'FAGSAK_STATUS' },
  kanRevurderingOpprettes: true,
  skalBehandlesAvInfotrygd: false,
  opprettet: '2021-02-04T12:45:39.785',
  endret: '2021-02-04T12:46:42.063',
  person: {
    erDod: false,
    alder: 50,
    diskresjonskode: null,
    dodsdato: null,
    erKvinne: true,
    navn: 'SKRAVLEPAPEGØYE GUNNHILD',
    personnummer: '30518028614',
    personstatusType: { kode: 'BOSA', kodeverk: 'PERSONSTATUS_TYPE' },
    aktørId: '9930518028614',
  },
} as Fagsak;

export const fagsakPersonMock = {
  alder: 30,
  personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
  erDod: false,
  erKvinne: true,
  navn: 'Espen Utvikler',
  personnummer: '12345',
} as fagsakPersonTsType;
