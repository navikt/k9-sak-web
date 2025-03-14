import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { render, screen } from '@testing-library/react';
import FagsakProfilSakIndex from '../FagsakProfilSakIndex';

describe('<FagsakProfile>', () => {
  it('skal vise en fagsak med tilhørende informasjon', () => {
    const status = 'OPPR';
    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakProfilSakIndex
          saksnummer="12345"
          fagsakYtelseType={fagsakYtelsesType.ENGANGSTØNAD}
          fagsakStatus={status}
          renderBehandlingMeny={vi.fn()}
          renderBehandlingVelger={vi.fn()}
        />
      </KodeverkProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Engangsstønad' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
  });

  it('skal vise dekningsgrad for foreldrepenger om den eksisterer', () => {
    const status = 'OPPR';
    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakProfilSakIndex
          saksnummer="12345"
          fagsakYtelseType={fagsakYtelsesType.FORELDREPENGER}
          fagsakStatus={status}
          renderBehandlingMeny={vi.fn()}
          renderBehandlingVelger={vi.fn()}
        />
      </KodeverkProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Foreldrepenger' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
  });

  it('skal ikke vise dekningsgrad for foreldrepenger om den ikke eksisterer', () => {
    const status = 'OPPR';
    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakProfilSakIndex
          saksnummer="12345"
          fagsakYtelseType={fagsakYtelsesType.FORELDREPENGER}
          fagsakStatus={status}
          renderBehandlingMeny={vi.fn()}
          renderBehandlingVelger={vi.fn()}
        />
      </KodeverkProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Foreldrepenger' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
  });

  it('skal ikke vise ugyldig dekningsgrad for foreldrepenger', () => {
    const status = 'OPPR';
    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakProfilSakIndex
          saksnummer="12345"
          fagsakYtelseType={fagsakYtelsesType.FORELDREPENGER}
          fagsakStatus={status}
          renderBehandlingMeny={vi.fn()}
          renderBehandlingVelger={vi.fn()}
        />
      </KodeverkProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Foreldrepenger' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
  });
});
