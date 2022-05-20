/* eslint-disable class-methods-use-this */
import React from 'react';
import sinon from 'sinon';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { Behandling, Fagsak } from '@k9-sak-web/types';

import { ProsessStegUtledet, ProsessStegPanelUtledet } from './ProsessStegUtledet';
import {
  utledProsessStegPaneler,
  getBekreftAksjonspunktCallback,
  formaterPanelerForProsessmeny,
  finnValgtPanel,
} from './prosessStegUtils';
import { ProsessStegDef, ProsessStegPanelDef } from './ProsessStegDef';

describe('<prosessStegUtils>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: 'test' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
  } as Fagsak;

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

  const aksjonspunkter = [
    {
      definisjon: { kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU, kodeverk: 'BEHANDLING_DEF' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'BEHANDLING_STATUS' },
      kanLoses: true,
      erAktivt: true,
      aksjonspunktType: { kode: aksjonspunktType.MANUELL, kodeverk: 'test' },
    },
  ];

  const vilkar = [
    {
      vilkarType: { kode: vilkarType.SOKERSOPPLYSNINGSPLIKT, kodeverk: 'test' },
      overstyrbar: false,
      perioder: [
        {
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          merknadParametere: {
            antattGodkjentArbeid: 'P0D',
            antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
          },
          periode: { fom: '2020-03-16', tom: '2020-03-19' },
        },
      ],
    },
  ];

  const kanOverstyreAccess = { isEnabled: false, employeeHasAccess: false };
  const isReadOnlyCheck = () => false;
  const toggleOverstyring = () => undefined;

  class TestPanelDef extends ProsessStegPanelDef {
    getKomponent = props => <div {...props} />;

    getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT];
  }

  const testPanelDef = new TestPanelDef();

  class TestProsessStegPanelDef extends ProsessStegDef {
    getUrlKode = () => 'test';

    getTekstKode = () => 'Behandlingspunkt.Test';

    getPanelDefinisjoner = () => [testPanelDef];
  }

  const testStegDef = new TestProsessStegPanelDef();
  const utledetTestDelPanel = new ProsessStegPanelUtledet(
    testStegDef,
    testPanelDef,
    isReadOnlyCheck,
    aksjonspunkter,
    vilkar,
    {},
    toggleOverstyring,
    kanOverstyreAccess,
    [],
  );
  const utledetTestPanel = new ProsessStegUtledet(testStegDef, [utledetTestDelPanel]);

  class PanelDef extends ProsessStegPanelDef {
    getKomponent = props => <div {...props} />;

    getAksjonspunktKoder = () => [aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU];

    getAksjonspunktTekstkoder = () => ['SokersOpplysningspliktForm.UtfyllendeOpplysninger'];

    getVilkarKoder = () => [vilkarType.SOKERSOPPLYSNINGSPLIKT];

    getData = ({ soknad }) => ({
      soknad,
    });
  }

  const panelDef = new PanelDef();

  class OpplysningspliktProsessStegPanelDef extends ProsessStegDef {
    getUrlKode = () => prosessStegCodes.OPPLYSNINGSPLIKT;

    getTekstKode = () => 'Behandlingspunkt.Opplysningsplikt';

    getPanelDefinisjoner = () => [panelDef];
  }

  it('skal utlede prosess-steg-paneler', () => {
    const ekstraPanelData = {
      soknad: 'test_soknad',
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

    const hasFetchError = false;
    const overstyrteAksjonspunktKoder = [];

    // ACT
    const prosessStegPaneler = utledProsessStegPaneler(
      [new OpplysningspliktProsessStegPanelDef()],
      ekstraPanelData,
      toggleOverstyring,
      overstyrteAksjonspunktKoder,
      behandling as Behandling,
      aksjonspunkter,
      vilkar,
      rettigheter,
      hasFetchError,
    );

    expect(prosessStegPaneler).toHaveLength(1);
    const panel = prosessStegPaneler[0];
    expect(panel.getUrlKode()).toEqual('opplysningsplikt');
    expect(panel.getTekstKode()).toEqual('Behandlingspunkt.Opplysningsplikt');
    expect(panel.getErReadOnly()).toBe(true);
    expect(panel.getErAksjonspunktOpen()).toBe(true);
    expect(panel.getAksjonspunkter()).toEqual(aksjonspunkter);
    expect(panel.getErStegBehandlet()).toBe(true);
    expect(panel.getStatus()).toEqual(vilkarUtfallType.IKKE_VURDERT);

    expect(panel.getDelPaneler()).toHaveLength(1);
    const delPanel = panel.getDelPaneler()[0];
    expect(delPanel.getAksjonspunktHjelpetekster()).toEqual(['SokersOpplysningspliktForm.UtfyllendeOpplysninger']);
    expect(delPanel.getAksjonspunkterForPanel()).toEqual(aksjonspunkter);
    expect(delPanel.getErAksjonspunktOpen()).toBe(true);
    expect(delPanel.getErReadOnly()).toBe(true);
    expect(delPanel.getStatus()).toEqual(vilkarUtfallType.IKKE_VURDERT);
    expect(delPanel.getProsessStegDelPanelDef().getEndepunkter()).toEqual([]);
    expect(delPanel.getProsessStegDelPanelDef().getKomponent).toEqual(panelDef.getKomponent);

    expect(delPanel.getKomponentData()).toEqual({
      aksjonspunkter,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      readOnlySubmitButton: false,
      soknad: ekstraPanelData.soknad,
      status: vilkarUtfallType.IKKE_VURDERT,
      vilkar,
    });
  });

  it('skal vise valgt panel', () => {
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(
      stegDef,
      panelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      vilkar,
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const erBehandlingHenlagt = false;
    const apentFaktaPanelInfo = undefined;

    const valgtPanel = finnValgtPanel(
      [utledetTestPanel, utledetPanel],
      erBehandlingHenlagt,
      'opplysningsplikt',
      apentFaktaPanelInfo,
    );

    expect(valgtPanel).toEqual(utledetPanel);
  });

  it('skal vise ikke vise prosess-steg panel når ingen er spesifikt valgt og en har åpent fakta-aksjonspunkt', () => {
    const erBehandlingHenlagt = false;
    const apentFaktaPanelInfo = { urlCode: 'FODSEL', textCode: 'Fakta.Test' };

    const valgtPanel = finnValgtPanel([utledetTestPanel], erBehandlingHenlagt, 'default', apentFaktaPanelInfo);

    expect(valgtPanel).toBeUndefined();
  });

  it('skal vise panel som har åpent aksjonspunkt', () => {
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(
      stegDef,
      panelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      vilkar,
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);
    const erBehandlingHenlagt = false;
    const apentFaktaPanelInfo = undefined;

    const valgtPanel = finnValgtPanel(
      [utledetTestPanel, utledetPanel],
      erBehandlingHenlagt,
      'default',
      apentFaktaPanelInfo,
    );

    expect(valgtPanel).toEqual(utledetPanel);
  });

  it('skal formatere paneler for prosessmeny', () => {
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(
      stegDef,
      panelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      vilkar,
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const formatertePaneler = formaterPanelerForProsessmeny([utledetTestPanel, utledetPanel], 'opplysningsplikt');
    expect(formatertePaneler).toEqual([
      {
        isActive: false,
        isDisabled: false,
        isFinished: false,
        labelId: 'Behandlingspunkt.Test',
        type: 'default',
        usePartialStatus: false,
      },
      {
        isActive: true,
        isDisabled: false,
        isFinished: false,
        labelId: 'Behandlingspunkt.Opplysningsplikt',
        type: 'warning',
        usePartialStatus: false,
      },
    ]);
  });

  it('skal lagre aksjonspunkt', async () => {
    const lagreAksjonspunkter = sinon.stub();
    lagreAksjonspunkter.returns(Promise.resolve());
    const lagringSideEffectsCallback = sinon.spy();

    const callback = getBekreftAksjonspunktCallback(
      lagringSideEffectsCallback,
      fagsak,
      behandling as Behandling,
      aksjonspunkter,
      lagreAksjonspunkter,
    );

    const aksjonspunktModeller = [
      {
        kode: aksjonspunkter[0].definisjon.kode,
      },
    ];

    await callback(aksjonspunktModeller);

    const requestKall = lagreAksjonspunkter.getCalls();
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0].args).toHaveLength(2);
    expect(requestKall[0].args[0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunktModeller[0].kode,
          kode: aksjonspunktModeller[0].kode,
        },
      ],
    });
  });

  it('skal lagre overstyrt aksjonspunkt', async () => {
    const lagreAksjonspunkter = sinon.spy();
    const lagreOverstyrteAksjonspunkter = sinon.stub();
    lagreOverstyrteAksjonspunkter.returns(Promise.resolve());
    const lagringSideEffectsCallback = sinon.spy();

    const callback = getBekreftAksjonspunktCallback(
      lagringSideEffectsCallback,
      fagsak,
      behandling as Behandling,
      aksjonspunkter,
      lagreAksjonspunkter,
      lagreOverstyrteAksjonspunkter,
    );

    const aksjonspunktModeller = [
      {
        kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      },
    ];

    await callback(aksjonspunktModeller);

    const requestKall = lagreOverstyrteAksjonspunkter.getCalls();
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0].args).toHaveLength(2);
    expect(requestKall[0].args[0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      overstyrteAksjonspunktDtoer: [
        {
          '@type': aksjonspunktModeller[0].kode,
          kode: aksjonspunktModeller[0].kode,
        },
      ],
    });
  });
});
