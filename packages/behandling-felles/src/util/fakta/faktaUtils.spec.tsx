/* eslint-disable class-methods-use-this */
import React from 'react';

import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import FaktaPanelDef from './FaktaPanelDef';
import FaktaPanelUtledet from './FaktaPanelUtledet';
import {
  DEFAULT_FAKTA_KODE,
  DEFAULT_PROSESS_STEG_KODE,
  finnValgtPanel,
  formaterPanelerForSidemeny,
  getBekreftAksjonspunktCallback,
  utledFaktaPaneler,
} from './faktaUtils';

describe('<faktaUtils>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelsesType.OMP,
    status: fagsakStatus.UNDER_BEHANDLING,
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
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const lagreAksjonspunkter = vi.fn().mockImplementation(() => Promise.resolve());

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

    const requestKall = lagreAksjonspunkter.mock.calls;
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0]).toHaveLength(2);
    expect(requestKall[0][0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[0],
          kode: aksjonspunkter[0],
        },
      ],
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0][0]).toEqual(DEFAULT_PROSESS_STEG_KODE);
  });

  it('skal lagre overstyrt aksjonspunkt', async () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const lagreAksjonspunkter = vi.fn();
    const lagreOverstyrteAksjonspunkter = vi.fn().mockImplementation(() => Promise.resolve());
    const overstyringApCodes = [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

    const callback = getBekreftAksjonspunktCallback(
      fagsak,
      behandling as Behandling,
      oppdaterProsessStegOgFaktaPanelIUrl,
      overstyringApCodes,
      lagreAksjonspunkter,
      lagreOverstyrteAksjonspunkter,
    );

    const aksjonspunkter = [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

    await callback(aksjonspunkter);

    const requestKall = lagreOverstyrteAksjonspunkter.mock.calls;
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0]).toHaveLength(2);
    expect(requestKall[0][0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [],
      overstyrteAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[0],
          kode: aksjonspunkter[0],
        },
      ],
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0][0]).toEqual(DEFAULT_PROSESS_STEG_KODE);
  });

  it('skal lagre både overstyrt og vanlig aksjonspunkt', async () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const lagreAksjonspunkter = vi.fn();
    const lagreOverstyrteAksjonspunkter = vi.fn().mockImplementation(() => Promise.resolve());
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
      aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
    ];

    await callback(aksjonspunkter);

    const requestKall = lagreOverstyrteAksjonspunkter.mock.calls;
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0]).toHaveLength(2);
    expect(requestKall[0][0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      overstyrteAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[0],
          kode: aksjonspunkter[0],
        },
      ],
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[1],
          kode: aksjonspunkter[1],
        },
      ],
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0][0]).toEqual(DEFAULT_PROSESS_STEG_KODE);
  });
});
