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
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from '../data/tilbakekrevingBehandlingApi';
import vedtakResultatType from '../kodeverk/vedtakResultatType';
import TilbakekrevingProsess from './TilbakekrevingProsess';

describe('<TilbakekrevingProsess>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: 'test' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
  } as Fagsak;

  const fagsakPerson = {
    alder: 30,
    personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
  };
  const behandling: Partial<Behandling> = {
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
      definisjon: { kode: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING, kodeverk: 'test' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
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
        foreldelseVurderingType: {
          kode: foreldelseVurderingType.FORELDET,
          kodeverk: 'FORELDRE_VURDERING_TYPE',
        },
      },
    ],
  } as FeilutbetalingPerioderWrapper;
  const beregningsresultat = {
    beregningResultatPerioder: [],
    vedtakResultatType: {
      kode: vedtakResultatType.INGEN_TILBAKEBETALING,
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
    },
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
        type: {
          kode: 'TEST',
          kodeverk: 'BEHANDLINGSRESULTAT',
        },
        konsekvenserForYtelsen: [],
      },
      behandlingÅrsaker: [
        {
          behandlingArsakType: {
            kode: '',
            kodeverk: '',
          },
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
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        opneSokeside={vi.fn()}
        harApenRevurdering={false}
        setBehandling={vi.fn()}
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
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();

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
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        opneSokeside={vi.fn()}
        harApenRevurdering={false}
        setBehandling={vi.fn()}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Foreldelse/i }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('foreldelse');
    expect(opppdaterKall[0][1]).toEqual('default');
  });
});
