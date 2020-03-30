import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { SideMenuWrapper, DataFetcherBehandlingDataV2 } from '@fpsak-frontend/behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';

import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import ForeldrepengerFakta from './PleiepengerFakta';

describe('<PleiepengerFakta>', () => {
  const fagsak = {
    saksnummer: 123456,
    fagsakYtelseType: { kode: fagsakYtelseType.PLEIEPENGER, kodeverk: 'test' },
    fagsakStatus: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
    fagsakPerson: {
      alder: 30,
      personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
      erDod: false,
      erKvinne: true,
      navn: 'Espen Utvikler',
      personnummer: '12345',
    },
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
  const navAnsatt = {
    brukernavn: 'Espen Utvikler',
    navn: 'Espen Utvikler',
    kanVeilede: false,
    kanSaksbehandle: true,
    kanOverstyre: false,
    kanBeslutte: false,
    kanBehandleKode6: false,
    kanBehandleKode7: false,
    kanBehandleKodeEgenAnsatt: false,
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
  const inntektArbeidYtelse = {
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

  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    const wrapper = shallowWithIntl(
      <ForeldrepengerFakta.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar, personopplysninger: soker }}
        behandling={behandling}
        fagsak={fagsak}
        navAnsatt={navAnsatt}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);
    expect(panel.prop('paneler')).is.eql([
      {
        erAktiv: true,
        harAksjonspunkt: true,
        tekst: 'Arbeidsforhold',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekst: 'Alder og omsorg',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekst: 'Sykdom',
      },
      { tekst: 'Uttak', erAktiv: false, harAksjonspunkt: false },
    ]);
  });

  it('skal oppdatere url ved valg av faktapanel', () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallowWithIntl(
      <ForeldrepengerFakta.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar }}
        behandling={behandling}
        fagsak={fagsak}
        navAnsatt={navAnsatt}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);

    panel.prop('onClick')(0);

    const calls = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql('default');
    expect(args[1]).to.eql('arbeidsforhold');
  });

  it('skal rendre faktapanel korrekt', () => {
    const wrapper = shallowWithIntl(
      <ForeldrepengerFakta.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar, inntektArbeidYtelse }}
        behandling={behandling}
        fagsak={fagsak}
        navAnsatt={navAnsatt}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const dataFetcher = wrapper.find(DataFetcherBehandlingDataV2);
    expect(dataFetcher.prop('behandlingVersion')).is.eql(behandling.versjon);
    expect(dataFetcher.prop('endpoints')).is.eql([]);

    const arbeidsforholdPanel = dataFetcher
      .renderProp('render')({})
      .find(ArbeidsforholdFaktaIndex);
    // eslint-disable-next-line
    expect(arbeidsforholdPanel.prop('readOnly')).is.false;
    // eslint-disable-next-line
    expect(arbeidsforholdPanel.prop('submittable')).is.true;
    // eslint-disable-next-line
    expect(arbeidsforholdPanel.prop('harApneAksjonspunkter')).is.true;
  });
});
