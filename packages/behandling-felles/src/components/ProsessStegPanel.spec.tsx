/* eslint-disable class-methods-use-this */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Aksjonspunkt, Behandling, Fagsak } from '@k9-sak-web/types';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import InngangsvilkarPanel from './InngangsvilkarPanel';
import BehandlingHenlagtPanel from './BehandlingHenlagtPanel';
import ProsessStegPanel from './ProsessStegPanel';
import MargMarkering from './MargMarkering';
import ProsessStegIkkeBehandletPanel from './ProsessStegIkkeBehandletPanel';
import { ProsessStegDef, ProsessStegPanelDef } from '../util/prosessSteg/ProsessStegDef';
import { ProsessStegUtledet, ProsessStegPanelUtledet } from '../util/prosessSteg/ProsessStegUtledet';

describe('<ProsessStegPanel>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelseType.FORELDREPENGER,
    status: fagsakStatus.UNDER_BEHANDLING,
  } as Fagsak;

  const behandling = {
    id: 1,
    versjon: 1,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FORSTEGANGSSOKNAD,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    links: [],
  };

  const aksjonspunkter: Aksjonspunkt[] = [
    {
      status: aksjonspunktStatus.OPPRETTET,
      definisjon: {
        kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
        kodeverk: 'AKSJONSPUNKT_DEF',
        skalAvbrytesVedTilbakeføring: false,
      },
      kanLoses: true,
      erAktivt: true,
    },
  ];

  const kanOverstyreAccess = { isEnabled: false, employeeHasAccess: false };

  const isReadOnlyCheck = () => false;

  const toggleOverstyring = () => undefined;

  const lagPanelDef = (id, aksjonspunktKoder, aksjonspunktTekstKoder) => {
    class PanelDef extends ProsessStegPanelDef {
      getId = () => '';

      getKomponent = props => <div {...props} />;

      getAksjonspunktKoder = () => aksjonspunktKoder;

      getAksjonspunktTekstkoder = () => aksjonspunktTekstKoder;
    }
    return new PanelDef();
  };

  const lagStegDef = (urlKode, panelDefs) => {
    class StegPanelDef extends ProsessStegDef {
      getUrlKode = () => urlKode;

      getTekstKode = () => urlKode;

      getPanelDefinisjoner = () => panelDefs;
    }
    return new StegPanelDef();
  };

  it('skal vise panel for henlagt behandling når valgt panel er vedtakspanelet og behandling er henlagt', () => {
    const vedtakPanelDef = lagPanelDef(
      prosessStegCodes.VEDTAK,
      [aksjonspunktCodes.AVKLAR_AKTIVITETER],
      ['VEDTAK.TEKST'],
    );
    const vedtakStegDef = lagStegDef(prosessStegCodes.VEDTAK, [vedtakPanelDef]);
    const utledetVedtakDelPanel = new ProsessStegPanelUtledet(
      vedtakStegDef,
      vedtakPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetVedtakSteg = new ProsessStegUtledet(vedtakStegDef, [utledetVedtakDelPanel]);

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={utledetVedtakSteg}
        fagsak={fagsak}
        behandling={
          {
            ...behandling,
            behandlingHenlagt: true,
          } as Behandling
        }
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={sinon.spy()}
        lagreAksjonspunkter={sinon.spy()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );

    expect(wrapper.find(BehandlingHenlagtPanel)).toHaveLength(1);
    expect(wrapper.find(MargMarkering)).toHaveLength(0);
    expect(wrapper.find(ProsessStegIkkeBehandletPanel)).toHaveLength(0);
  });

  it('skal vise panel for steg ikke behandlet når steget ikke er behandlet og saken ikke er henlagt', () => {
    const vedtakPanelDef = lagPanelDef(
      prosessStegCodes.VEDTAK,
      [aksjonspunktCodes.AVKLAR_AKTIVITETER],
      ['VEDTAK.TEKST'],
    );
    const vedtakStegDef = lagStegDef(prosessStegCodes.VEDTAK, [vedtakPanelDef]);
    const utledetVedtakDelPanel = new ProsessStegPanelUtledet(
      vedtakStegDef,
      vedtakPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetVedtakSteg = new ProsessStegUtledet(vedtakStegDef, [utledetVedtakDelPanel]);

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={utledetVedtakSteg}
        fagsak={fagsak}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={sinon.spy()}
        lagreAksjonspunkter={sinon.spy()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );

    expect(wrapper.find(ProsessStegIkkeBehandletPanel)).toHaveLength(1);
    expect(wrapper.find(BehandlingHenlagtPanel)).toHaveLength(0);
    expect(wrapper.find(MargMarkering)).toHaveLength(0);
  });

  it('skal vise panel for inngangsvilkår når det er data for flere panel', () => {
    const fodselAksjonspunkter: Aksjonspunkt[] = [
      {
        ...aksjonspunkter[0],
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
          kodeverk: 'AKSJONSPUNKT_DEF',
          skalAvbrytesVedTilbakeføring: false,
        },
      },
    ];
    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.AVKLAR_AKTIVITETER], ['FODSEL.TEKST']);
    const omsorgPanelDef = lagPanelDef('OMSORG', [], ['OMSORG.TEKST']);
    const inngangsvilkarStegDef = lagStegDef(prosessStegCodes.INNGANGSVILKAR, [fodselPanelDef, omsorgPanelDef]);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(
      inngangsvilkarStegDef,
      fodselPanelDef,
      isReadOnlyCheck,
      fodselAksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetOmsorgDelPanel = new ProsessStegPanelUtledet(
      inngangsvilkarStegDef,
      omsorgPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetInngangsvilkarSteg = new ProsessStegUtledet(inngangsvilkarStegDef, [
      utledetFodselDelPanel,
      utledetOmsorgDelPanel,
    ]);

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={utledetInngangsvilkarSteg}
        fagsak={fagsak}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={sinon.spy()}
        lagreAksjonspunkter={sinon.spy()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );

    expect(wrapper.find(MargMarkering)).toHaveLength(1);
    expect(wrapper.find(ProsessStegIkkeBehandletPanel)).toHaveLength(0);
    expect(wrapper.find(BehandlingHenlagtPanel)).toHaveLength(0);

    expect(wrapper.find(InngangsvilkarPanel)).toHaveLength(1);
    expect(wrapper.find('DataFetcher')).toHaveLength(0);
  });

  it('skal vise kun vise ett panel', () => {
    const fodselAksjonspunkter: Aksjonspunkt[] = [
      {
        ...aksjonspunkter[0],
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
          kodeverk: 'AKSJONSPUNKT_DEF',
          skalAvbrytesVedTilbakeføring: false,
        },
      },
    ];
    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.AVKLAR_AKTIVITETER], ['FODSEL.TEKST']);
    const inngangsvilkarStegDef = lagStegDef(prosessStegCodes.INNGANGSVILKAR, [fodselPanelDef]);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(
      inngangsvilkarStegDef,
      fodselPanelDef,
      isReadOnlyCheck,
      fodselAksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetInngangsvilkarSteg = new ProsessStegUtledet(inngangsvilkarStegDef, [utledetFodselDelPanel]);

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={utledetInngangsvilkarSteg}
        fagsak={fagsak}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={sinon.spy()}
        lagreAksjonspunkter={sinon.spy()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );

    expect(wrapper.find(MargMarkering)).toHaveLength(1);
    expect(wrapper.find(ProsessStegIkkeBehandletPanel)).toHaveLength(0);
    expect(wrapper.find(BehandlingHenlagtPanel)).toHaveLength(0);

    const komponent = wrapper.find('div');
    expect(komponent).toHaveLength(1);
    expect(komponent.prop('status')).toEqual(vilkarUtfallType.IKKE_VURDERT);
    expect(komponent.prop('isReadOnly')).toBe(false);
    expect(komponent.prop('readOnlySubmitButton')).toBe(false);
    expect(komponent.prop('isAksjonspunktOpen')).toBe(true);
    expect(wrapper.find(InngangsvilkarPanel)).toHaveLength(0);
  });

  it('skal lagre aksjonspunkt', async () => {
    const fodselAksjonspunkter: Aksjonspunkt[] = [
      {
        ...aksjonspunkter[0],
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
          kodeverk: 'AKSJONSPUNKT_DEF',
          skalAvbrytesVedTilbakeføring: false,
        },
      },
    ];
    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.AVKLAR_AKTIVITETER], ['FODSEL.TEKST']);
    const omsorgPanelDef = lagPanelDef('OMSORG', [], ['OMSORG.TEKST']);
    const inngangsvilkarStegDef = lagStegDef(prosessStegCodes.INNGANGSVILKAR, [fodselPanelDef, omsorgPanelDef]);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(
      inngangsvilkarStegDef,
      fodselPanelDef,
      isReadOnlyCheck,
      fodselAksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetOmsorgDelPanel = new ProsessStegPanelUtledet(
      inngangsvilkarStegDef,
      omsorgPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetInngangsvilkarSteg = new ProsessStegUtledet(inngangsvilkarStegDef, [
      utledetFodselDelPanel,
      utledetOmsorgDelPanel,
    ]);

    const lagringSideeffekterCallback = sinon.spy();
    const makeRestApiRequest = sinon.stub();
    makeRestApiRequest.returns(Promise.resolve());

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={utledetInngangsvilkarSteg}
        fagsak={fagsak}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={lagringSideeffekterCallback}
        lagreAksjonspunkter={makeRestApiRequest}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );

    const panel = wrapper.find(InngangsvilkarPanel);

    const aksjonspunktModels = [
      {
        kode: fodselAksjonspunkter[0].definisjon.kode,
      },
    ];
    panel.prop('submitCallback')(aksjonspunktModels);

    expect(await lagringSideeffekterCallback.getCalls()).toHaveLength(1);

    const requestKall = makeRestApiRequest.getCalls();
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0].args).toHaveLength(2);
    expect(requestKall[0].args[0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunktModels[0].kode,
          kode: aksjonspunktModels[0].kode,
        },
      ],
    });
  });
});
