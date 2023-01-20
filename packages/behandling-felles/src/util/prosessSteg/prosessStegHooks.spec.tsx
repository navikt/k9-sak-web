/* eslint-disable class-methods-use-this */
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Aksjonspunkt, Behandling, Fagsak } from '@k9-sak-web/types';

import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { ProsessStegDef, ProsessStegPanelDef } from './ProsessStegDef';
import prosessStegHooks from './prosessStegHooks';
import { ProsessStegPanelUtledet, ProsessStegUtledet } from './ProsessStegUtledet';

const HookWrapper = ({ callback }) => <div data-values={callback()} />;

const testHook = callback => shallow(<HookWrapper callback={callback} />);

describe('<prosessStegHooks>', () => {
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

  const aksjonspunkter: Aksjonspunkt[] = [
    {
      definisjon: {
        kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
        kodeverk: 'AKSJONSPUNKT_DEF',
        skalAvbrytesVedTilbakeføring: false,
      },
      status: aksjonspunktStatus.OPPRETTET,
      kanLoses: true,
      erAktivt: true,
    },
  ];

  const vilkar = [
    {
      vilkarType: vilkarType.SOKERSOPPLYSNINGSPLIKT,
      overstyrbar: false,
      perioder: [
        {
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
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

  it('skal utlede prosesstegpaneler, valgt panel og paneler formatert for meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
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

    const apentFaktaPanelInfo = undefined;

    const hasFetchError = false;

    const valgtProsessSteg = 'default';

    // ACT
    const wrapper = testHook(() =>
      prosessStegHooks.useProsessStegPaneler(
        [new OpplysningspliktProsessStegPanelDef()],
        ekstraPanelData,
        fagsak,
        rettigheter,
        behandling as Behandling,
        aksjonspunkter,
        vilkar,
        hasFetchError,
        valgtProsessSteg,
        apentFaktaPanelInfo,
      ),
    );
    const dataValues: any[] = wrapper.find('div').prop('data-values');

    // @ts-ignore
    const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = Object.values({
      ...dataValues,
      // @ts-ignore
    }).reduce((acc, value) => [...acc, value], []);

    expect(prosessStegPaneler).toHaveLength(1);
    const panel = prosessStegPaneler[0];
    expect(valgtPanel).toEqual(panel);
    expect(formaterteProsessStegPaneler).toEqual([
      {
        isActive: true,
        isDisabled: false,
        isFinished: false,
        labelId: 'Behandlingspunkt.Opplysningsplikt',
        type: ProcessMenuStepType.warning,
        usePartialStatus: false,
      },
    ]);
  });

  it('skal velge første prosess-steg', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;
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

    const valgtFaktaSteg = 'default';
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const valgtProsessSteg = 'default';

    const wrapper = testHook(() =>
      prosessStegHooks.useProsessStegVelger(
        [utledetPanel],
        valgtFaktaSteg,
        behandling as Behandling,
        oppdaterProsessStegOgFaktaPanelIUrl,
        valgtProsessSteg,
      ),
    );
    const prosessStegVelger = wrapper.find('div').prop('data-values') as (number) => void;

    prosessStegVelger(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual('opplysningsplikt');
    expect(opppdaterKall[0].args[1]).toEqual('default');
  });

  it('skal skjule prosess-steg når en velger steg som allerede vises', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;
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

    const valgtFaktaSteg = 'default';
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const valgtProsessSteg = 'opplysningsplikt';

    const wrapper = testHook(() =>
      prosessStegHooks.useProsessStegVelger(
        [utledetPanel],
        valgtFaktaSteg,
        behandling as Behandling,
        oppdaterProsessStegOgFaktaPanelIUrl,
        valgtProsessSteg,
      ),
    );
    const prosessStegVelger = wrapper.find('div').prop('data-values') as (number) => void;

    prosessStegVelger(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toBeUndefined();
    expect(opppdaterKall[0].args[1]).toEqual('default');
  });

  it('skal bekrefte aksjonspunkt', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;
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

    const lagreAksjonspunkter = sinon.stub();
    lagreAksjonspunkter.returns(Promise.resolve());
    const lagringSideEffectsCallback = () => () => {};

    const wrapper = testHook(() =>
      prosessStegHooks.useBekreftAksjonspunkt(
        fagsak,
        behandling as Behandling,
        lagringSideEffectsCallback,
        lagreAksjonspunkter,
        undefined,
        utledetPanel,
      ),
    );
    const bekreftAksjonspunkt = wrapper.find('div').prop('data-values') as (number) => void;

    await bekreftAksjonspunkt([{ kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU }]);

    const requestKall = lagreAksjonspunkter.getCalls();
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0].args).toHaveLength(2);
    expect(requestKall[0].args[0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[0].definisjon.kode,
          kode: aksjonspunkter[0].definisjon.kode,
        },
      ],
    });
  });
});
