import React from 'react';
import { shallow } from 'enzyme';

import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Fagsak, TotrinnskontrollAksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';

import { requestApi, K9sakApiKeys } from '../../data/k9sakApi';
import TotrinnskontrollIndex from './TotrinnskontrollIndex';
import BeslutterModalIndex from './BeslutterModalIndex';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
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
      behandlingArsaker: [],
    },
  ];

  const kodeverk = {
    [kodeverkTyper.SKJERMLENKE_TYPE]: [],
  };

  const createAksjonspunkt = aksjonspunktKode =>
    ({
      aksjonspunktKode,
      beregningDto: null,
      besluttersBegrunnelse: null,
      opptjeningAktiviteter: [],
      totrinnskontrollGodkjent: null,
      vurderPaNyttArsaker: [],
    } as TotrinnskontrollAksjonspunkt);

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

  const getTotrinnsaksjonspunkterFoedsel = () => ({
    skjermlenkeType: 'FAKTA_OM_FOEDSEL',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL),
      createAksjonspunkt(aksjonspunktCodes.TERMINBEKREFTELSE),
      createAksjonspunkt(aksjonspunktCodes.AUTO_VENT_PÅ_FODSELREGISTRERING),
    ],
  });

  const getTotrinnsaksjonspunkterOmsorg = () => ({
    skjermlenkeType: 'FAKTA_FOR_OMSORG',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.OMSORGSOVERTAKELSE),
      createAksjonspunkt(aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET),
    ],
  });

  const getTotrinnsaksjonspunkterForeldreansvar = () => ({
    skjermlenkeType: 'PUNKT_FOR_FORELDREANSVAR',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD),
      createAksjonspunkt(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD),
    ],
  });

  it('skal vise modal når beslutter godkjenner', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, kodeverk);
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, kodeverk);
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(K9sakApiKeys.TOTRINNS_KLAGE_VURDERING, {});
    requestApi.mock(K9sakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT);

    const totrinnskontrollAksjonspunkter = [
      getTotrinnsaksjonspunkterFoedsel(),
      getTotrinnsaksjonspunkterOmsorg(),
      getTotrinnsaksjonspunkterForeldreansvar(),
    ];
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
