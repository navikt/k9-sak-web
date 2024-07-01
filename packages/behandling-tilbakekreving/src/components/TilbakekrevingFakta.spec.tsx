import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { RestApiErrorProvider } from '@k9-sak-web/rest-api-hooks';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { requestTilbakekrevingApi, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';
import vedtakResultatType from '../kodeverk/vedtakResultatType';
import TilbakekrevingFakta from './TilbakekrevingFakta';

describe('<TilbakekrevingFakta>', () => {
  const fagsak: Fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelsesType.OMP,
    status: fagsakStatus.UNDER_BEHANDLING,
    relasjonsRolleType: '',
    barnFodt: '',
    person: {
      erDod: false,
      navn: '',
      alder: 0,
      personnummer: '',
      erKvinne: false,
      personstatusType: '',
      diskresjonskode: '',
      dodsdato: '',
      aktørId: '',
    },
    opprettet: '',
    endret: '',
    antallBarn: 0,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    dekningsgrad: 0,
  };

  const behandling: Partial<Behandling> = {
    id: 1,
    versjon: 2,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FØRSTEGANGSSØKNAD,
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
      behandlingÅrsaker: [{ behandlingArsakType: 'test' }],
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
          oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
          hasFetchError={false}
          setBehandling={vi.fn()}
        />
      </RestApiErrorProvider>,
    );

    expect(screen.getByRole('button', { name: /Feilutbetaling/i })).toBeInTheDocument();
  });

  it('skal oppdatere url ved valg av faktapanel', async () => {
    requestTilbakekrevingApi.mock(TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
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
          setBehandling={vi.fn()}
        />
      </RestApiErrorProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Feilutbetaling/i }));
    });

    const { calls } = oppdaterProsessStegOgFaktaPanelIUrl.mock;
    expect(calls).toHaveLength(1);
    const args = calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toEqual('default');
    expect(args[1]).toEqual('feilutbetaling');
  });
});
