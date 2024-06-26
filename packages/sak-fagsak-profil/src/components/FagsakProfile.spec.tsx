import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { behandlingType } from "@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js";
import { intlMock } from '../../i18n/index';
import { FagsakProfile } from './FagsakProfile';
import messages from '../../i18n/nb_NO.json';

describe('<FagsakProfile>', () => {
  it('skal vise en fagsak med tilhørende informasjon', () => {
    const fagsakYtelseType = 'ES';
    const status = 'OPPR';

    renderWithIntl(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakProfile
          saksnummer="12345"
          fagsakYtelseType={fagsakYtelseType}
          fagsakStatus={status}
          renderBehandlingMeny={vi.fn()}
          renderBehandlingVelger={vi.fn()}
          dekningsgrad={100}
          intl={intlMock}
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Engangsstønad' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
  });

  it('skal vise dekningsgrad for foreldrepenger om den eksisterer', () => {
    const fagsakYtelseType = 'FP';
    const status = 'OPPR';

    renderWithIntl(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakProfile
          saksnummer="12345"
          fagsakYtelseType={fagsakYtelseType}
          fagsakStatus={status}
          renderBehandlingMeny={vi.fn()}
          renderBehandlingVelger={vi.fn()}
          dekningsgrad={100}
          intl={intlMock}
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Foreldrepenger' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
    expect(screen.getByText('Dekningsgraden er 100%')).toBeInTheDocument();
  });

  it('skal ikke vise dekningsgrad for foreldrepenger om den ikke eksisterer', () => {
    const fagsakYtelseType = 'FP';
    const status = 'OPPR';

    renderWithIntl(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakProfile
          saksnummer="12345"
          fagsakYtelseType={fagsakYtelseType}
          fagsakStatus={status}
          renderBehandlingMeny={vi.fn()}
          renderBehandlingVelger={vi.fn()}
          intl={intlMock}
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Foreldrepenger' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
    expect(screen.queryByText(/dekningsgraden/i)).not.toBeInTheDocument();
  });

  it('skal ikke vise ugyldig dekningsgrad for foreldrepenger', () => {
    const fagsakYtelseType = 'FP';
    const status = 'OPPR';

    renderWithIntl(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakProfile
          saksnummer="12345"
          fagsakYtelseType={fagsakYtelseType}
          fagsakStatus={status}
          renderBehandlingMeny={vi.fn()}
          renderBehandlingVelger={vi.fn()}
          dekningsgrad={73}
          intl={intlMock}
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Foreldrepenger' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
    expect(screen.queryByText(/dekningsgraden/i)).not.toBeInTheDocument();
  });
});
