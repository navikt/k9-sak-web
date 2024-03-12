import React from 'react';
import sinon from 'sinon';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Behandling, Fagsak, FeilutbetalingPerioderWrapper } from '@k9-sak-web/types';

import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from '../data/tilbakekrevingBehandlingApi';
import vedtakResultatType from '../kodeverk/vedtakResultatType';
import TilbakekrevingProsess from './TilbakekrevingProsess';

describe('<TilbakekrevingProsess>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelseType.FORELDREPENGER,
    status: fagsakStatus.UNDER_BEHANDLING,
  } as Fagsak;

  const fagsakPerson = {
    alder: 30,
    personstatusType: personstatusType.BOSATT,
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
  };
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
      definisjon: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
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
  } as FeilutbetalingPerioderWrapper;
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
          behandlingArsakType: '',
        },
      ],
    },
  };

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.VILKARVURDERINGSPERIODER, {
      perioder: [{ vilkarResultat: undefined, begrunnelse: '', vilkarResultatInfo: undefined, ytelser: [] }],
    });
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.VILKARVURDERING, { vilkarsVurdertePerioder: [] });
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.VEDTAKSBREV, []);
    renderWithIntlAndReduxForm(
      <TilbakekrevingProsess.WrappedComponent
        intl={intlMock}
        data={{
          aksjonspunkter,
          perioderForeldelse,
          beregningsresultat,
          feilutbetalingFakta,
        }}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        opneSokeside={sinon.spy()}
        harApenRevurdering={false}
        setBehandling={sinon.spy()}
      />,
    );

    expect(screen.getByRole('button', { name: /Foreldelse/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tilbakekreving/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vedtak/i })).toBeInTheDocument();
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.VILKARVURDERINGSPERIODER, {
      perioder: [{ vilkarResultat: undefined, begrunnelse: '', vilkarResultatInfo: undefined, ytelser: [] }],
    });
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.VILKARVURDERING, { vilkarsVurdertePerioder: [] });
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.VEDTAKSBREV, []);

    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();

    renderWithIntlAndReduxForm(
      <TilbakekrevingProsess.WrappedComponent
        intl={intlMock}
        data={{
          aksjonspunkter,
          perioderForeldelse,
          beregningsresultat,
          feilutbetalingFakta,
        }}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        opneSokeside={sinon.spy()}
        harApenRevurdering={false}
        setBehandling={sinon.spy()}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Foreldelse/i }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual('foreldelse');
    expect(opppdaterKall[0].args[1]).toEqual('default');
  });
});
