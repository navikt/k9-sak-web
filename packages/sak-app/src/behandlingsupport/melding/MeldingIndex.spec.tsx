import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MeldingerSakIndex, { MessagesModalSakIndex } from '@k9-sak-web/sak-meldinger';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';

import behandlingEventHandler from '../../behandling/BehandlingEventHandler';
import { requestApi, K9sakApiKeys } from '../../data/k9sakApi';
import MeldingIndex from './MeldingIndex';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('<MeldingIndex>', () => {
  const recipients = ['Søker'];

  const fagsak = {
    saksnummer: '123456',
    person: { aktørId: '123' },
  };

  const alleBehandlinger = [
    {
      id: 1,
      uuid: '1212',
      type: {
        kode: BehandlingType.FORSTEGANGSSOKNAD,
        kodeverk: '',
      },
    },
  ];

  const kodeverk = {
    [kodeverkTyper.VENT_AARSAK]: [],
  };

  const templates = [
    { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
    { kode: 'Mal2', navn: 'Mal 2', tilgjengelig: true },
    { kode: 'Mal3', navn: 'Mal 3', tilgjengelig: true },
  ];

  const assignMock = jest.fn();
  delete window.location;
  // @ts-ignore Dette er kun for å unngå warnings med window.location.reload(). (Denne blir brukt som en temp-fiks, så dette skal derfor fjernes)
  window.location = { reload: assignMock };

  afterEach(() => {
    assignMock.mockClear();
  });

  it('skal vise messages når mottakere og brevmaler har blitt hentet fra server', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(K9sakApiKeys.BREVMALER, templates);

    const wrapper = shallow(
      <MeldingIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={123}
      />,
    );

    const index = wrapper.find(MeldingerSakIndex);
    expect(index.prop('recipients')).toEqual(recipients);
    expect(index.prop('templates')).toEqual(templates);
  });

  it('skal sette default tom streng ved forhåndsvisning dersom fritekst ikke er fylt ut', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(K9sakApiKeys.BREVMALER, templates);
    requestApi.mock(K9sakApiKeys.PREVIEW_MESSAGE_FORMIDLING, {});

    const wrapper = shallow(
      <MeldingIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={123}
      />,
    );

    const index = wrapper.find(MeldingerSakIndex);
    const previewCallback = index.prop('previewCallback') as (params: any) => void;
    previewCallback({ mottaker: 'Søker', brevmalkode: 'Mal1' });

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.PREVIEW_MESSAGE_FORMIDLING);
    expect(reqData).toHaveLength(1);
    expect(reqData[0].params.dokumentdata.fritekst).toBe(' ');
  });

  it('skal lukke av modal', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(K9sakApiKeys.BREVMALER, templates);
    requestApi.mock(K9sakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(
      <MeldingIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={123}
      />,
    );

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'testbrevkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (messageArg: any) => Promise<any>;

    expect(wrapper.find(MessagesModalSakIndex)).toHaveLength(0);

    await submitCallback(message);

    const modal = wrapper.find(MessagesModalSakIndex);
    expect(modal).toHaveLength(1);

    const closeEvent = modal.prop('closeEvent') as () => void;
    closeEvent();

    expect(wrapper.find(MessagesModalSakIndex)).toHaveLength(0);
  });

  it('skal sende melding', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(K9sakApiKeys.BREVMALER, templates);
    requestApi.mock(K9sakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(
      <MeldingIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={123}
      />,
    );

    const message = {
      mottaker: 'Espen Utvikler',
      brevmalkode: 'testkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (params: any) => void;
    await submitCallback(message);

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).toHaveLength(1);
    expect(reqData[0].params).toEqual({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal sende melding og ikke sette saken på vent hvis ikke Innhent eller forlenget', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(K9sakApiKeys.BREVMALER, templates);
    requestApi.mock(K9sakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(
      <MeldingIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={123}
      />,
    );

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'testbrevkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (messageArg: any) => Promise<any>;

    expect(wrapper.find(MessagesModalSakIndex)).toHaveLength(0);
    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(0);

    await submitCallback(message);

    expect(wrapper.find(MessagesModalSakIndex)).toHaveLength(1);
    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(0);

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).toHaveLength(1);
    expect(reqData[0].params).toEqual({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal sende melding og sette saken på vent hvis INNHENT_DOK', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(K9sakApiKeys.BREVMALER, templates);
    requestApi.mock(K9sakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(
      <MeldingIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={123}
      />,
    );

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'INNHEN',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (messageArg: any) => Promise<any>;

    expect(wrapper.find(MessagesModalSakIndex)).toHaveLength(0);
    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(0);

    await submitCallback(message);

    expect(wrapper.find(MessagesModalSakIndex)).toHaveLength(0);
    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(1);

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).toHaveLength(1);
    expect(reqData[0].params).toEqual({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal sende melding og sette saken på vent hvis FORLEN', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(K9sakApiKeys.BREVMALER, templates);
    requestApi.mock(K9sakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(
      <MeldingIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={123}
      />,
    );

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'FORLEN',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (messageArg: any) => Promise<any>;

    expect(wrapper.find(MessagesModalSakIndex)).toHaveLength(0);
    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(0);

    await submitCallback(message);

    expect(wrapper.find(MessagesModalSakIndex)).toHaveLength(0);
    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(1);

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).toHaveLength(1);
    expect(reqData[0].params).toEqual({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal håndtere melding fra modal', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(K9sakApiKeys.BREVMALER, templates);
    requestApi.mock(K9sakApiKeys.SUBMIT_MESSAGE);

    const setBehandlingOnHoldCallback = sinon.spy();
    behandlingEventHandler.setHandler({
      settBehandlingPaVent: setBehandlingOnHoldCallback,
    });

    const wrapper = shallow(
      <MeldingIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={123}
      />,
    );

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'FORLEN',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (messageArg: any) => Promise<any>;

    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(0);
    await submitCallback(message);
    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(1);

    const formValues = {
      frist: '2017-10-10',
      ventearsak: 'TEST',
    };
    wrapper.find(SettPaVentModalIndex).prop('submitCallback')(formValues);

    expect(setBehandlingOnHoldCallback).toHaveProperty('callCount', 1);
    const { args } = setBehandlingOnHoldCallback.getCalls()[0];
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual({
      behandlingId: 1,
      behandlingVersjon: 123,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    });

    expect(mockHistoryPush).toHaveBeenCalledWith('/');

    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(0);

    behandlingEventHandler.clear();
  });
});
