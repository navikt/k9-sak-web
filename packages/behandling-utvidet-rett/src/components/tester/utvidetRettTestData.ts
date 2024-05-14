import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { Aksjonspunkt, Behandling, Fagsak, FagsakPerson, Rammevedtak, Vilkar } from '@k9-sak-web/types';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
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
    {
      definisjon: { kode: aksjonspunktCodes.FORESLA_VEDTAK, kodeverk: 'test' },
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
      arbeidsforholdreferanser: [],
    },
  },
  behandling: {
    id: 995,
    versjon: 22,
    status: { kode: behandlingStatus.AVSLUTTET, kodeverk: 'tilTest' },
    type: { kode: behandlingType.FØRSTEGANGSSØKNAD, kodeverk: 'BEHANDLING_TYPE' },
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  } as Behandling,
  fagsak: {
    saksnummer: '111111',
    sakstype: { kode: fagsakYtelsesType.OMP_KS, kodeverk: 'FAGSAK_YTELSE' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'FAGSAK_STATUS' },
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
  vilkar: [
    {
      vilkarType: { kode: vilkarType.UTVIDETRETTVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.OMP_OMSORGENFORVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
  ] as Vilkar[],
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
