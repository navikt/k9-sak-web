import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { Aksjonspunkt, Behandling, Fagsak, FagsakPerson, Vilkar } from '@k9-sak-web/types';

const utvidetRettTestData = {
  aksjonspunkter: [
    {
      definisjon: { kode: aksjonspunktCodes.OMSORGEN_FOR, kodeverk: 'test' },
      status: { kode: 'UTFO', kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    },
  ] as Aksjonspunkt[],
  behandling: {
    id: 1,
    versjon: 2,
    status: { kode: behandlingStatus.AVSLUTTET, kodeverk: 'test' },
    type: { kode: 'BT-002', kodeverk: 'test' },
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  } as Behandling,
  fagsak: {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN, kodeverk: 'test' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
  } as Fagsak,
  fagsakPerson: {
    alder: 30,
    personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
  } as FagsakPerson,
  forbrukteDager: {
    totaltAntallDager: 20,
    antallKoronadager: 0,
    antallDagerArbeidsgiverDekker: 3,
    antallDagerInfotrygd: 0,
    forbrukteDager: 5,
    forbruktTid: 'PT37H30M',
    restdager: 12,
    restTid: 'PT90H',
    smitteverndager: 'PT0S',
    rammevedtak: [
      {
        type: 'OverføringFår',
        vedtatt: '2020-01-01',
        lengde: 'PT480H',
        gyldigFraOgMed: '2020-01-01',
        gyldigTilOgMed: '2022-02-04',
        avsender: '02099541043',
      },
    ],
    barna: [
      {
        personIdent: '30482094089',
        fødselsdato: '2021-02-02',
        dødsdato: null,
        harSammeBosted: true,
        barnType: BarnType.VANLIG,
      },
    ],
  } as ÅrskvantumForbrukteDager,
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
};

export default utvidetRettTestData;
