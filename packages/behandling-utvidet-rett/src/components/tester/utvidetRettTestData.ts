import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { Aksjonspunkt, Behandling, Fagsak, FagsakPerson, Vilkar, Rammevedtak } from '@k9-sak-web/types';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import UtvidetRettSoknad from '../../types/UtvidetRettSoknad';

const utvidetRettTestData = {
  aksjonspunkter: [
    {
      definisjon: aksjonspunktCodes.OMSORGEN_FOR,
      status: 'UTFO',
      kanLoses: true,
      erAktivt: true,
    },
    {
      definisjon: aksjonspunktCodes.UTVIDET_RETT,
      status: 'UTFO',
      kanLoses: true,
      erAktivt: true,
    },
    {
      definisjon: aksjonspunktCodes.FORESLA_VEDTAK,
      status: 'UTFO',
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
    status: behandlingStatus.AVSLUTTET,
    type: 'BT-002',
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  } as Behandling,
  fagsak: {
    saksnummer: '111111',
    sakstype: fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN,
    status: fagsakStatus.UNDER_BEHANDLING,
  } as Fagsak,
  fagsakPerson: {
    alder: 25,
    personstatusType: personstatusType.BOSATT,
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
      vilkarType: vilkarType.UTVIDETRETTVILKARET,
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: vilkarType.OMP_OMSORGENFORVILKARET,
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
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
        situasjonKode: '',
        tilleggsopplysninger: '',
      },
    ],
    mottattDato: '2021-02-18',
    oppgittStartdato: '2021-02-18',
    oppgittTilknytning: null,
    soknadsdato: '2021-02-18',
    spraakkode: 'NB',
    tilleggsopplysninger: null,
    søknadsperiode: {
      fom: '2021-02-18',
      tom: '9999-12-31',
    },
  } as UtvidetRettSoknad,
};

export default utvidetRettTestData;
