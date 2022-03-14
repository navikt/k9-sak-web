import React from 'react';
import sinon from 'sinon';

import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { SideMenuWrapper } from '@k9-sak-web/behandling-felles';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { requestTilbakekrevingApi, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';
import TilbakekrevingFakta from './TilbakekrevingFakta';
import vedtakResultatType from '../kodeverk/vedtakResultatType';

describe('<TilbakekrevingFakta>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelseType.FORELDREPENGER,
    status: fagsakStatus.UNDER_BEHANDLING,
  } as Fagsak;

  const behandling: Partial<Behandling> = {
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
      definisjon: aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING,
      status: aksjonspunktStatus.OPPRETTET,
      kanLoses: true,
      erAktivt: true,
    },
  ];
  const perioderForeldelse = {
    perioder: [
      {
        fom: '2019-01-01',
        tom: '2019-04-01',
        belop: 1212,
        foreldelseVurderingType: foreldelseVurderingType.FORELDET,
      },
    ],
  };
  const beregningsresultat = {
    beregningResultatPerioder: [],
    vedtakResultatType: vedtakResultatType.INGEN_TILBAKEBETALING,
  };
  const feilutbetalingFakta = {
    behandlingFakta: {
      aktuellFeilUtbetaltBeløp: 122,
      datoForRevurderingsvedtak: '2020-01-01',
      totalPeriodeFom: '2020-01-01',
      totalPeriodeTom: '2020-02-01',
      perioder: [
        {
          fom: '2020-01-01',
          tom: '2020-02-01',
          belop: 1212,
        },
      ],
      behandlingsresultat: {
        type: 'TEST',
        konsekvenserForYtelsen: [],
      },
      behandlingÅrsaker: [
        {
          behandlingArsakType: 'test',
        },
      ],
    },
  };

  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK, []);
    const wrapper = shallowWithIntl(
      <TilbakekrevingFakta.WrappedComponent
        intl={intlMock}
        data={{
          aksjonspunkter,
          perioderForeldelse,
          beregningsresultat,
          feilutbetalingFakta,
        }}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        fpsakKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        hasFetchError={false}
        setBehandling={sinon.spy()}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);
    expect(panel.prop('paneler')).toEqual([
      {
        erAktiv: true,
        harAksjonspunkt: true,
        tekst: 'Feilutbetaling',
      },
    ]);
  });

  it('skal oppdatere url ved valg av faktapanel', () => {
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallowWithIntl(
      <TilbakekrevingFakta.WrappedComponent
        intl={intlMock}
        data={{
          aksjonspunkter,
          perioderForeldelse,
          beregningsresultat,
          feilutbetalingFakta,
        }}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        fpsakKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        hasFetchError={false}
        setBehandling={sinon.spy()}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);

    panel.prop('onClick')(0);

    const calls = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toEqual('default');
    expect(args[1]).toEqual('feilutbetaling');
  });
});
