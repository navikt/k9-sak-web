import React from 'react';
import { shallow } from 'enzyme';

import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Fagsak, BehandlingAppKontekst } from '@k9-sak-web/types';

import { requestApi, K9sakApiKeys } from '../../data/k9sakApi';
import TotrinnskontrollIndex from './TotrinnskontrollIndex';
import BeslutterModalIndex from './BeslutterModalIndex';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useHistory: () => ({
    push: vi.fn(),
  }),
  useLocation: () => ({
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  }),
}));

describe('<TotrinnskontrollIndex>', () => {
  const fagsak = {
    saksnummer: '1',
    sakstype: {
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: '',
    },
    person: {
      aktørId: '123',
    },
  };

  const alleBehandlinger = [
    {
      id: 1234,
      versjon: 123,
      type: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        kodeverk: '',
      },
      opprettet: '‎29.08.‎2017‎ ‎09‎:‎54‎:‎22',
      status: {
        kode: 'FVED',
        kodeverk: 'BEHANDLING_STATUS',
      },
      toTrinnsBehandling: true,
      ansvarligSaksbehandler: 'Espen Utvikler',
      behandlingÅrsaker: [],
    },
  ];

  const kodeverk = {
    [kodeverkTyper.SKJERMLENKE_TYPE]: [],
  };

  const navAnsatt = {
    brukernavn: 'Test',
    kanBehandleKode6: false,
    kanBehandleKode7: false,
    kanBehandleKodeEgenAnsatt: false,
    kanBeslutte: true,
    kanOverstyre: false,
    kanSaksbehandle: true,
    kanVeilede: false,
    navn: 'Test',
  };

  it('skal vise modal når beslutter godkjenner', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, kodeverk);
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, kodeverk);
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(K9sakApiKeys.TOTRINNS_KLAGE_VURDERING, {});
    requestApi.mock(K9sakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT);
    requestApi.mock(K9sakApiKeys.TILGJENGELIGE_VEDTAKSBREV, {});

    const totrinnskontrollAksjonspunkter = [];
    requestApi.mock(K9sakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER, totrinnskontrollAksjonspunkter);

    const wrapper = shallow(
      <TotrinnskontrollIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={alleBehandlinger[0].id}
        behandlingVersjon={alleBehandlinger[0].versjon}
      />,
    );

    const index = wrapper.find(TotrinnskontrollSakIndex);

    expect(wrapper.find(BeslutterModalIndex)).toHaveLength(0);

    const submit = index.prop('onSubmit') as (params: any) => void;
    submit({
      fatterVedtakAksjonspunktDto: {
        '@type': '5016',
        aksjonspunktGodkjenningDtos: [],
        begrunnelse: null,
      },
    });

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT);
    expect(reqData).toHaveLength(1);
    expect(reqData[0].params).toEqual({
      behandlingId: 1234,
      saksnummer: '1',
      behandlingVersjon: 123,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': '5016',
          aksjonspunktGodkjenningDtos: [],
          begrunnelse: null,
        },
      ],
    });

    expect(wrapper.find(BeslutterModalIndex)).toHaveLength(1);
  });
});
