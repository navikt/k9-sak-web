/* eslint-disable class-methods-use-this */
import React from 'react';
import sinon from 'sinon';
import { IntlShape } from 'react-intl';

import { Behandling, Fagsak } from '@k9-sak-web/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import FaktaPanelDef from './FaktaPanelDef';
import FaktaPanelUtledet from './FaktaPanelUtledet';
import {
  utledFaktaPaneler,
  finnValgtPanel,
  formaterPanelerForSidemeny,
  getBekreftAksjonspunktCallback,
  DEFAULT_FAKTA_KODE,
  DEFAULT_PROSESS_STEG_KODE,
} from './faktaUtils';

describe('<faktaUtils>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelseType.FORELDREPENGER,
    status: fagsakStatus.UNDER_BEHANDLING,
  } as Fagsak;
  const behandling = {
    id: 1,
    versjon: 2,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FORSTEGANGSSOKNAD,
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  };

  class ArbeidsforholdFaktaPanelDef extends FaktaPanelDef {
    getUrlKode = () => faktaPanelCodes.ARBEIDSFORHOLD;

    getTekstKode = () => 'ArbeidsforholdInfoPanel.Title';

    getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

    getKomponent = props => <ArbeidsforholdFaktaIndex {...props} />;

    getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;

    getData = ({ personopplysninger, arbeidsforhold }) => ({ personopplysninger, arbeidsforhold });
  }
  class TestFaktaPanelDef extends FaktaPanelDef {
    getUrlKode = () => 'test';

    getTekstKode = () => 'Test.Title';

    getKomponent = () => <div>test</div>;
  }

  it('skal utlede faktapanel', () => {
    const ekstraPanelData = {
      personopplysninger: 'test_personopplysninger',
      arbeidsforhold: 'test_arbeidsforhold',
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

    const panelDef = new ArbeidsforholdFaktaPanelDef();

    const faktaPaneler = utledFaktaPaneler(
      [panelDef],
      ekstraPanelData,
      behandling as Behandling,
      rettigheter,
      aksjonspunkter,
    );

    expect(faktaPaneler).toHaveLength(1);
    expect(faktaPaneler[0].getPanelDef()).toEqual(panelDef);
    expect(faktaPaneler[0].getHarApneAksjonspunkter()).toBe(true);
    expect(faktaPaneler[0].getKomponentData(rettigheter, ekstraPanelData, false)).toEqual({
      aksjonspunkter: [aksjonspunkter[0]],
      readOnly: false,
      submittable: true,
      harApneAksjonspunkter: true,
      alleMerknaderFraBeslutter: {
        [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: { notAccepted: undefined },
      },
      personopplysninger: ekstraPanelData.personopplysninger,
      arbeidsforhold: ekstraPanelData.arbeidsforhold,
    });
  });

  it('skal finne ut at valgt faktapanel er panelet med åpent aksjonspunkt', () => {
    const panelDef = new ArbeidsforholdFaktaPanelDef();
    const panelDef2 = new TestFaktaPanelDef();

    const aksjonspunkter = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
        status: aksjonspunktStatus.OPPRETTET,
        kanLoses: true,
        erAktivt: true,
      },
    ];

    const paneler = [
      new FaktaPanelUtledet(panelDef2, behandling, []),
      new FaktaPanelUtledet(panelDef, behandling, aksjonspunkter),
    ];
    const valgtFaktaPanelKode = DEFAULT_FAKTA_KODE;

    const valgtPanel = finnValgtPanel(paneler, valgtFaktaPanelKode);

    expect(valgtPanel.getUrlKode()).toEqual(paneler[1].getUrlKode());
  });

  it('skal finne ut at valgt faktapanel er første panel når det ikke finnes åpne aksjonspunkter', () => {
    const panelDef = new ArbeidsforholdFaktaPanelDef();
    const panelDef2 = new TestFaktaPanelDef();
    const paneler = [new FaktaPanelUtledet(panelDef, behandling, []), new FaktaPanelUtledet(panelDef2, behandling, [])];

    const valgtFaktaPanelKode = DEFAULT_FAKTA_KODE;

    const valgtPanel = finnValgtPanel(paneler, valgtFaktaPanelKode);

    expect(valgtPanel.getUrlKode()).toEqual(paneler[0].getUrlKode());
  });

  it('skal finne faktapanel som er satt i URL', () => {
    const panelDef = new ArbeidsforholdFaktaPanelDef();
    const panelDef2 = new TestFaktaPanelDef();
    const paneler = [new FaktaPanelUtledet(panelDef, behandling, []), new FaktaPanelUtledet(panelDef2, behandling, [])];

    const valgtFaktaPanelKode = paneler[1].getUrlKode();

    const valgtPanel = finnValgtPanel(paneler, valgtFaktaPanelKode);

    expect(valgtPanel.getUrlKode()).toEqual(paneler[1].getUrlKode());
  });

  it('skal formatere paneler for sidemeny', () => {
    const panelDef = new ArbeidsforholdFaktaPanelDef();
    const panelDef2 = new TestFaktaPanelDef();
    const aksjonspunkter = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
        status: aksjonspunktStatus.OPPRETTET,
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const paneler = [
      new FaktaPanelUtledet(panelDef, behandling, aksjonspunkter),
      new FaktaPanelUtledet(panelDef2, behandling, []),
    ];
    const valgtFaktaPanelKode = paneler[0].getUrlKode();

    const formatertePaneler = formaterPanelerForSidemeny(paneler, valgtFaktaPanelKode);

    expect(formatertePaneler).toEqual([
      {
        tekstKode: paneler[0].getTekstKode(),
        erAktiv: true,
        harAksjonspunkt: true,
      },
      {
        tekstKode: paneler[1].getTekstKode(),
        erAktiv: false,
        harAksjonspunkt: false,
      },
    ]);
  });

  it('skal lagre aksjonspunkt', async () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const lagreAksjonspunkter = sinon.stub();
    lagreAksjonspunkter.returns(Promise.resolve());

    const overstyringApCodes = [];

    const callback = getBekreftAksjonspunktCallback(
      fagsak,
      behandling as Behandling,
      oppdaterProsessStegOgFaktaPanelIUrl,
      overstyringApCodes,
      lagreAksjonspunkter,
    );

    const aksjonspunkter = [
      {
        kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      },
    ];

    await callback(aksjonspunkter);

    const requestKall = lagreAksjonspunkter.getCalls();
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0].args).toHaveLength(2);
    expect(requestKall[0].args[0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[0].kode,
          kode: aksjonspunkter[0].kode,
        },
      ],
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0].args[0]).toEqual(DEFAULT_PROSESS_STEG_KODE);
  });

  it('skal lagre overstyrt aksjonspunkt', async () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const lagreAksjonspunkter = sinon.spy();
    const lagreOverstyrteAksjonspunkter = sinon.stub();
    lagreOverstyrteAksjonspunkter.returns(Promise.resolve());
    const overstyringApCodes = [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

    const callback = getBekreftAksjonspunktCallback(
      fagsak,
      behandling as Behandling,
      oppdaterProsessStegOgFaktaPanelIUrl,
      overstyringApCodes,
      lagreAksjonspunkter,
      lagreOverstyrteAksjonspunkter,
    );

    const aksjonspunkter = [
      {
        kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      },
    ];

    await callback(aksjonspunkter);

    const requestKall = lagreOverstyrteAksjonspunkter.getCalls();
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0].args).toHaveLength(2);
    expect(requestKall[0].args[0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [],
      overstyrteAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[0].kode,
          kode: aksjonspunkter[0].kode,
        },
      ],
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0].args[0]).toEqual(DEFAULT_PROSESS_STEG_KODE);
  });

  it('skal lagre både overstyrt og vanlig aksjonspunkt', async () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const lagreAksjonspunkter = sinon.spy();
    const lagreOverstyrteAksjonspunkter = sinon.stub();
    lagreOverstyrteAksjonspunkter.returns(Promise.resolve());
    const overstyringApCodes = [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

    const callback = getBekreftAksjonspunktCallback(
      fagsak,
      behandling as Behandling,
      oppdaterProsessStegOgFaktaPanelIUrl,
      overstyringApCodes,
      lagreAksjonspunkter,
      lagreOverstyrteAksjonspunkter,
    );

    const aksjonspunkter = [
      {
        kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
      },
      {
        kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
      },
    ];

    await callback(aksjonspunkter);

    const requestKall = lagreOverstyrteAksjonspunkter.getCalls();
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0].args).toHaveLength(2);
    expect(requestKall[0].args[0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      overstyrteAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[0].kode,
          kode: aksjonspunkter[0].kode,
        },
      ],
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[1].kode,
          kode: aksjonspunkter[1].kode,
        },
      ],
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0].args[0]).toEqual(DEFAULT_PROSESS_STEG_KODE);
  });
});
