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
import ForeldrepengerFakta from './PleiepengerFakta';
import FetchedData from '../types/fetchedDataTsType';
import { PleiepengerBehandlingApiKeys, requestPleiepengerApi } from '../data/pleiepengerBehandlingApi';

describe('<PleiepengerFakta>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelseType.PLEIEPENGER,
    status: fagsakStatus.UNDER_BEHANDLING,
  } as Fagsak;
  const fagsakPerson = {
    alder: 30,
    personstatusType: personstatusType.BOSATT,
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
  };
  const behandling = {
    id: 1,
    versjon: 2,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FORSTEGANGSSOKNAD,
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    stegTilstand: {
      stegType: {
        kode: '',
      },
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
      definisjon: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      status: aksjonspunktStatus.OPPRETTET,
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
    personstatus: 'BOSA',
    avklartPersonstatus: {
      overstyrtPersonstatus: personstatusType.BOSATT,
      orginalPersonstatus: personstatusType.DOD,
    },
    navBrukerKjonn: '',
    statsborgerskap: '',
    diskresjonskode: '',
    sivilstand: sivilstandType.UGIFT,
    region: 'NORDEN',
    adresser: [
      {
        adresselinje1: 'Vei 1',
        postNummer: '1000',
        poststed: 'Oslo',
        adresseType: opplysningAdresseType.POSTADRESSE,
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

  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD, arbeidsforhold);
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      personopplysninger: soker,
    };

    const wrapper = shallow(
      <ForeldrepengerFakta
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
        featureToggles={{ UTENLANDSOPPHOLD: true }}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);
    expect(panel.prop('paneler')).toEqual([
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'OmBarnetInfoPanel.Title',
      },
      {
        erAktiv: true,
        harAksjonspunkt: true,
        tekstKode: 'ArbeidsforholdInfoPanel.Title',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'OmsorgenForInfoPanel.Title',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'MedisinskVilkarPanel.MedisinskVilkar',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'EtablertTilsynInfoPanel.Title',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'InntektsmeldingInfoPanel.Title',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'InntektOgYtelser.Title',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekstKode: 'UtenlandsoppholdInfoPanel.Title',
      },
      { erAktiv: false, harAksjonspunkt: false, tekstKode: 'SoknadsperioderPanel.Soknadsperioder' },
    ]);
  });

  it('skal oppdatere url ved valg av faktapanel', () => {
    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD, arbeidsforhold);

    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
    };

    const wrapper = shallow(
      <ForeldrepengerFakta
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
        featureToggles={{}}
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
    const wrapper = shallow(
      <ForeldrepengerFakta
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
        featureToggles={{}}
      />,
    );

    const arbeidsforholdPanel = wrapper.find(ArbeidsforholdFaktaIndex);
    expect(arbeidsforholdPanel.prop('readOnly')).toBe(false);
    expect(arbeidsforholdPanel.prop('submittable')).toBe(true);
    expect(arbeidsforholdPanel.prop('harApneAksjonspunkter')).toBe(true);
  });
});
