import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { RestApiErrorProvider } from '@k9-sak-web/rest-api-hooks';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from '../data/tilbakekrevingBehandlingApi';
import vedtakResultatType from '../kodeverk/vedtakResultatType';
import TilbakekrevingFakta from './TilbakekrevingFakta';

describe('<TilbakekrevingFakta>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: 'test' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
  } as Fagsak;

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
      definisjon: { kode: aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING, kodeverk: 'test' },
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
  };
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
            kode: 'test',
            kodeverk: 'test',
          },
        },
      ],
    },
  };

  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK, []);
    renderWithIntlAndReduxForm(
      <RestApiErrorProvider>
        <TilbakekrevingFakta
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
        />
      </RestApiErrorProvider>,
    );

    expect(screen.getByRole('button', { name: /Feilutbetaling/i })).toBeInTheDocument();
  });

  it('skal oppdatere url ved valg av faktapanel', async () => {
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    renderWithIntlAndReduxForm(
      <RestApiErrorProvider>
        <TilbakekrevingFakta
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
        />
      </RestApiErrorProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Feilutbetaling/i }));
    });

    const calls = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toEqual('default');
    expect(args[1]).toEqual('feilutbetaling');
  });
});
