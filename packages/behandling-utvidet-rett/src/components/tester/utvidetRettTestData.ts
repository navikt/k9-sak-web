import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { Aksjonspunkt, Behandling, Fagsak, FagsakPerson, Vilkar, Rammevedtak } from '@k9-sak-web/types';
import UtvidetRettSoknad from '../../types/UtvidetRettSoknad';

const utvidetRettTestData = {
  aksjonspunkter: [
    {
      definisjon: { kode: aksjonspunktCodes.OMSORGEN_FOR, kodeverk: 'test' },
      status: { kode: 'UTFO', kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    },
    {
      definisjon: { kode: aksjonspunktCodes.UTVIDET_RETT, kodeverk: 'test' },
      status: { kode: 'UTFO', kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    },
  ] as Aksjonspunkt[],
  arbeidsgiverOpplysningerPerId: {
    345: {
      erPrivatPerson: false,
      identifikator: 'test',
      navn: 'test',
    },
  },
  behandling: {
    id: 995,
    versjon: 22,
    status: { kode: behandlingStatus.AVSLUTTET, kodeverk: 'tilTest' },
    type: { kode: 'BT-002', kodeverk: 'tilTest' },
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  } as Behandling,
  fagsak: {
    saksnummer: '111111',
    sakstype: { kode: fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN, kodeverk: 'tilTest' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'tilTest' },
  } as Fagsak,
  fagsakPerson: {
    alder: 25,
    personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'tilTest' },
    erDod: false,
    erKvinne: false,
    navn: 'Espen testperson',
    personnummer: '11111',
  } as FagsakPerson,
  rammevedtak: [
    {
      type: 'OverføringFår',
      vedtatt: '2020-01-01',
      lengde: '',
      gyldigFraOgMed: '2020-01-01',
      gyldigTilOgMed: '2022-02-04',
      avsender: '',
    },
  ] as Rammevedtak[],
  rettigheter: {
    writeAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
    kanOverstyreAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
  },
  vilkar: [] as Vilkar[],
  soknad: {
    begrunnelseForSenInnsending: null,
    manglendeVedlegg: [],
    angittePersoner: [
      {
        navn: 'DUCK DOLE',
        fødselsdato: '',
        rolle: 'BARN',
        aktørId: '',
        personIdent: '',
      },
    ],
    mottattDato: '2021-02-18',
    oppgittStartdato: '2021-02-18',
    oppgittTilknytning: null,
    soknadsdato: '2021-02-18',
    spraakkode: {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
    },
    tilleggsopplysninger: null,
    søknadsperiode: {
      fom: '2021-02-18',
      tom: '9999-12-31',
    },
  } as UtvidetRettSoknad,
};

export default utvidetRettTestData;
