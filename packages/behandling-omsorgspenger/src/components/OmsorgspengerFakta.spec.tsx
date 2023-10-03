import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import { SideMenuWrapper } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { Behandling, Fagsak } from '@k9-sak-web/types';

import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import OmsorgspengerFakta from './OmsorgspengerFakta';
import FetchedData from '../types/fetchedDataTsType';
import { OmsorgspengerBehandlingApiKeys, requestOmsorgApi } from '../data/omsorgspengerBehandlingApi';

const getbehandlingPerioderårsakMedVilkår = (fom: string, tom: string) => ({
  perioderMedÅrsak: {
    perioderTilVurdering: [{ fom, tom }],
    perioderMedÅrsak: [{ periode: { fom, tom }, årsaker: ['FØRSTEGANGSVURDERING'] }],
    årsakMedPerioder: [{ årsak: 'FØRSTEGANGSVURDERING', perioder: [{ fom, tom }] }],
    dokumenterTilBehandling: [
      {
        journalpostId: '4129401',
        innsendingsTidspunkt: '2023-07-12T00:00:00',
        type: 'INNTEKTSMELDING',
        søktePerioder: [
          {
            periode: { fom, tom },
            type: 'AT',
            arbeidsgiver: { arbeidsgiverOrgnr: '910909088', arbeidsgiverAktørId: null },
            arbeidsforholdRef: null,
          },
          {
            periode: { fom, tom },
            type: 'AT',
            arbeidsgiver: { arbeidsgiverOrgnr: '910909088', arbeidsgiverAktørId: null },
            arbeidsforholdRef: null,
          },
        ],
      },
    ],
  },
  periodeMedUtfall: [{ periode: { fom, tom }, utfall: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' } }],
  forrigeVedtak: [],
});

describe('<OmsorgspengerFakta>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: 'test' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
  } as Fagsak;
  const fagsakPerson = {
    alder: 30,
    personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
  };
  const behandling = {
    id: 1,
    versjon: 2,
    status: { kode: behandlingStatus.BEHANDLING_UTREDES, kodeverk: 'test' },
    type: { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: 'test' },
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  };
  const rettigheter = {
    writeAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
    kanOverstyreAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
  };
  const aksjonspunkter = [
    {
      definisjon: { kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, kodeverk: 'test' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    },
  ];
  const vilkar = [];
  const arbeidsforhold = [
    {
      arbeidsgiverReferanse: '12345678',
      kilde: {
        kode: '-',
      },
    },
  ];

  const soker = {
    navn: 'Espen Utvikler',
    aktoerId: '1',
    personstatus: {
      kode: 'BOSA',
      kodeverk: 'Bosatt',
    },
    avklartPersonstatus: {
      overstyrtPersonstatus: {
        kode: personstatusType.BOSATT,
        kodeverk: 'Bosatt',
      },
      orginalPersonstatus: {
        kode: personstatusType.DOD,
        kodeverk: 'Bosatt',
      },
    },
    navBrukerKjonn: {
      kode: '',
      kodeverk: '',
    },
    statsborgerskap: {
      kode: '',
      kodeverk: '',
    },
    diskresjonskode: {
      kode: '',
      kodeverk: '',
    },
    sivilstand: {
      kode: sivilstandType.UGIFT,
      kodeverk: 'Ugift',
    },
    region: {
      kode: 'NORDEN',
      kodeverk: 'Norden',
    },
    adresser: [
      {
        adresselinje1: 'Vei 1',
        postNummer: '1000',
        poststed: 'Oslo',
        adresseType: {
          kode: opplysningAdresseType.POSTADRESSE,
          kodeverk: 'Bostedsadresse',
        },
      },
    ],
    barn: [],
  };

  const arbeidsgiverOpplysningerPerId = {
    123: {
      erPrivatPerson: false,
      identifikator: 'testId',
      navn: 'testNavn',
      arbeidsforholdreferanser: [],
    },
  };

  // const behandlingPerioderårsakMedVilkår =

  it('skal rendre faktapaneler og sidemeny korrekt uten Omsorgen for', () => {
    requestOmsorgApi.mock(OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD, undefined);
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      personopplysninger: soker,
      behandlingPerioderårsakMedVilkår: getbehandlingPerioderårsakMedVilkår('2022-05-01', '2022-05-10'),
    };

    const wrapper = shallow(
      <OmsorgspengerFakta
        data={fetchedData as FetchedData}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        dokumenter={[]}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);
    expect(panel.prop('paneler')).toEqual([
      {
        erAktiv: true,
        harAksjonspunkt: true,
        tekstKode: 'ArbeidsforholdInfoPanel.Title',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'InntektOgYtelser.Title',
      },
    ]);
  });

  it('skal rendre faktapaneler og sidemeny korrekt med Omsorgen for', () => {
    requestOmsorgApi.mock(OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD, undefined);
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      personopplysninger: soker,
      behandlingPerioderårsakMedVilkår: getbehandlingPerioderårsakMedVilkår('2023-05-01', '2023-05-10'),
    };

    const wrapper = shallow(
      <OmsorgspengerFakta
        data={fetchedData as FetchedData}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        dokumenter={[]}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);
    expect(panel.prop('paneler')).toEqual([
      {
        erAktiv: true,
        harAksjonspunkt: true,
        tekstKode: 'ArbeidsforholdInfoPanel.Title',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'InntektOgYtelser.Title',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'OmsorgenForInfoPanel.Title',
      },
    ]);
  });

  it('skal oppdatere url ved valg av faktapanel', () => {
    requestOmsorgApi.mock(OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD, undefined);
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
    };

    const wrapper = shallow(
      <OmsorgspengerFakta
        data={fetchedData as FetchedData}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        dokumenter={[]}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);

    panel.prop('onClick')(0);

    const calls = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toEqual('default');
    expect(args[1]).toEqual('arbeidsforhold');
  });

  it('skal rendre faktapanel korrekt', () => {
    requestOmsorgApi.mock(OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD, arbeidsforhold);
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
    };

    const wrapper = shallow(
      <OmsorgspengerFakta
        data={fetchedData as FetchedData}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        dokumenter={[]}
      />,
    );

    const arbeidsforholdPanel = wrapper.find(ArbeidsforholdFaktaIndex);
    expect(arbeidsforholdPanel.prop('readOnly')).toBe(false);
    expect(arbeidsforholdPanel.prop('submittable')).toBe(true);
    expect(arbeidsforholdPanel.prop('harApneAksjonspunkter')).toBe(true);
  });
});
