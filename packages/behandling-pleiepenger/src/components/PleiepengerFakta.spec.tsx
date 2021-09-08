import React from 'react';
import sinon from 'sinon';

import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
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
import ForeldrepengerFakta from './PleiepengerFakta';
import FetchedData from '../types/fetchedDataTsType';
import { PleiepengerBehandlingApiKeys, requestPleiepengerApi } from '../data/pleiepengerBehandlingApi';

describe('<PleiepengerFakta>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.PLEIEPENGER, kodeverk: 'test' },
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
  const arbeidsforhold = {
    skalKunneLeggeTilNyeArbeidsforhold: true,
    skalKunneLageArbeidsforholdBasertPaInntektsmelding: true,
    relatertTilgrensendeYtelserForAnnenForelder: [],
  };

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
    },
  };

  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD, arbeidsforhold);
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      personopplysninger: soker,
    };

    const wrapper = shallowWithIntl(
      <ForeldrepengerFakta.WrappedComponent
        intl={intlMock}
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
        dokumenter={[]}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);
    expect(panel.prop('paneler')).toEqual([
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekst: 'Om barnet',
      },
      {
        erAktiv: true,
        harAksjonspunkt: true,
        tekst: 'Arbeidsforhold',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekst: 'Omsorgen for',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekst: 'Sykdom',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekst: 'Etablert tilsyn',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekst: 'Inntektsmelding',
      },
    ]);
  });

  it('skal oppdatere url ved valg av faktapanel', () => {
    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD, arbeidsforhold);

    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
    };

    const wrapper = shallowWithIntl(
      <ForeldrepengerFakta.WrappedComponent
        intl={intlMock}
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
    expect(args[1]).toEqual('om-barnet');
  });

  it('skal rendre faktapanel korrekt', () => {
    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD, arbeidsforhold);
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
    };
    const wrapper = shallowWithIntl(
      <ForeldrepengerFakta.WrappedComponent
        intl={intlMock}
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
        dokumenter={[]}
      />,
    );

    const arbeidsforholdPanel = wrapper.find(ArbeidsforholdFaktaIndex);
    expect(arbeidsforholdPanel.prop('readOnly')).toBe(false);
    expect(arbeidsforholdPanel.prop('submittable')).toBe(true);
    expect(arbeidsforholdPanel.prop('harApneAksjonspunkter')).toBe(true);
  });
});
