import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Fagsak } from '@k9-sak-web/types';
import * as useHistory from '../../app/useHistory';
import * as useLocation from '../../app/useLocation';
import { requestApi, FpsakApiKeys } from '../../data/fpsakApi';
import BehandlingAppKontekst from '../../behandling/behandlingAppKontekstTsType';
import { ApprovalIndex } from './ApprovalIndex';
import BeslutterModalIndex from './BeslutterModalIndex';

describe('<ApprovalIndex>', () => {
  const fagsak = {
    saksnummer: 1,
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

  const locationMock = {
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  };

  let contextStubHistory;
  let contextStubLocation;
  beforeEach(() => {
    // @ts-ignore
    contextStubHistory = sinon.stub(useHistory, 'default').callsFake(() => ({ push: sinon.spy() }));
    contextStubLocation = sinon.stub(useLocation, 'default').callsFake(() => locationMock);
  });

  afterEach(() => {
    contextStubHistory.restore();
    contextStubLocation.restore();
  });

  const kodeverk = {
    [kodeverkTyper.SKJERMLENKE_TYPE]: [],
  };

  const createAksjonspunkt = aksjonspunktKode => ({
    aksjonspunktKode,
    beregningDto: null,
    besluttersBegrunnelse: null,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: null,
    vurderPaNyttArsaker: [],
  });

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
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.KODEVERK_FPTILBAKE, kodeverk);
    requestApi.mock(FpsakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(FpsakApiKeys.FEATURE_TOGGLE, { featureToggles: {} });
    requestApi.mock(FpsakApiKeys.TOTRINNS_KLAGE_VURDERING, {});
    requestApi.mock(FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT);

    const totrinnskontrollAksjonspunkter = [
      getTotrinnsaksjonspunkterFoedsel(),
      getTotrinnsaksjonspunkterOmsorg(),
      getTotrinnsaksjonspunkterForeldreansvar(),
    ];

    const wrapper = shallow(
      <ApprovalIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={alleBehandlinger[0].id}
        behandlingVersjon={alleBehandlinger[0].versjon}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollAksjonspunkter}
      />,
    );

    const index = wrapper.find(TotrinnskontrollSakIndex);

    expect(wrapper.find(BeslutterModalIndex)).to.have.length(0);

    const submit = index.prop('onSubmit') as (params: any) => void;
    submit({
      approvals: [
        {
          aksjonspunkter: [],
        },
      ],
    });

    const reqData = requestApi.getRequestMockData(FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT);
    expect(reqData).to.have.length(1);
    expect(reqData[0].params).is.eql({
      behandlingId: 1234,
      saksnummer: 1,
      behandlingVersjon: 123,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': '5016',
          aksjonspunktGodkjenningDtos: [],
          begrunnelse: null,
        },
      ],
    });

    expect(wrapper.find(BeslutterModalIndex)).to.have.length(1);
  });
});
