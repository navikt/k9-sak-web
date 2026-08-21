import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårPeriodeDto.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TiDagerBackendApiType } from './TiDagerBackendApiType.js';
import { TiDagerBackendClientContext } from './TiDagerBackendClientContext.js';
import { TiDagerProsessIndex } from './TiDagerProsessIndex.js';

vi.mock('./TiDagerProsess.js', () => ({
  TiDagerProsess: ({
    vilkårErFerdigVurdert,
    vilkårErOppfylt,
  }: {
    vilkårErFerdigVurdert: boolean;
    vilkårErOppfylt: boolean;
  }) => (
    <div data-testid="TiDagerProsess">
      <span data-testid="vilkårErFerdigVurdert">{String(vilkårErFerdigVurdert)}</span>
      <span data-testid="vilkårErOppfylt">{String(vilkårErOppfylt)}</span>
    </div>
  ),
}));

const ingenJournalposter: TiDagerBackendApiType = {
  hentRettFraDagEnOpplysninger: async () => ({ journalposter: [] }),
};

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

const lagVilkår = (periodeStatuser: VilkårPeriodeDto['vilkarStatus'][]): VilkårMedPerioderDto[] => [
  {
    vilkarType: 'K9_VK_9_8',
    relevanteInnvilgetMerknader: [],
    perioder: periodeStatuser.map((status, i) => ({
      vilkarStatus: status,
      periode: { fom: `2026-04-0${i + 1}`, tom: `2026-04-0${i + 1}` },
      vurderesIBehandlingen: true,
      merknadParametere: {},
    })),
  },
];

const defaultProps = {
  aksjonspunkter: [],
  isReadOnly: false,
  behandlingUUID: 'test-uuid',
  saksnummer: '123',
  submitCallback: vi.fn(),
};

const renderComponent = (vilkar: VilkårMedPerioderDto[], api = ingenJournalposter) =>
  render(
    <QueryClientProvider client={createQueryClient()}>
      <TiDagerBackendClientContext value={api}>
        <TiDagerProsessIndex {...defaultProps} vilkar={vilkar} />
      </TiDagerBackendClientContext>
    </QueryClientProvider>,
  );

describe('TiDagerProsessIndex', () => {
  it('viser "10 dager har blitt dekket" når alle perioder er oppfylt og det ikke er journalposter', async () => {
    renderComponent(lagVilkår([vilkårStatus.OPPFYLT, vilkårStatus.OPPFYLT]));

    expect(await screen.findByText('10 dager har blitt dekket')).toBeInTheDocument();
    expect(screen.queryByTestId('TiDagerProsess')).not.toBeInTheDocument();
  });

  it('viser TiDagerProsess når én periode er OPPFYLT og én er IKKE_VURDERT', async () => {
    renderComponent(lagVilkår([vilkårStatus.OPPFYLT, vilkårStatus.IKKE_VURDERT]));

    const prosess = await screen.findByTestId('TiDagerProsess');
    expect(screen.queryByText('10 dager har blitt dekket')).not.toBeInTheDocument();
    expect(prosess.querySelector('[data-testid="vilkårErFerdigVurdert"]')?.textContent).toBe('false');
    expect(prosess.querySelector('[data-testid="vilkårErOppfylt"]')?.textContent).toBe('true');
  });

  it('vilkårErFerdigVurdert er true når alle perioder er vurdert', async () => {
    renderComponent(lagVilkår([vilkårStatus.OPPFYLT, vilkårStatus.IKKE_OPPFYLT]));

    const prosess = await screen.findByTestId('TiDagerProsess');
    expect(prosess.querySelector('[data-testid="vilkårErFerdigVurdert"]')?.textContent).toBe('true');
  });

  it('vilkårErOppfylt er false når ingen perioder er oppfylt', async () => {
    renderComponent(lagVilkår([vilkårStatus.IKKE_OPPFYLT, vilkårStatus.IKKE_OPPFYLT]));

    const prosess = await screen.findByTestId('TiDagerProsess');
    expect(prosess.querySelector('[data-testid="vilkårErOppfylt"]')?.textContent).toBe('false');
  });

  it('viser TiDagerProsess selv om alle perioder er oppfylt når det finnes journalposter', async () => {
    const apiMedJournalpost: TiDagerBackendApiType = {
      hentRettFraDagEnOpplysninger: async () => ({
        journalposter: [
          {
            journalpostId: 'JP-001',
            dokumentId: 'DOK-001',
            arbeidsgiver: { arbeidsgiverOrgnr: '910909088' },
            foersteOppgitteFravaersdag: '2026-04-01',
          },
        ],
      }),
    };

    renderComponent(lagVilkår([vilkårStatus.OPPFYLT, vilkårStatus.OPPFYLT]), apiMedJournalpost);

    expect(await screen.findByTestId('TiDagerProsess')).toBeInTheDocument();
    expect(screen.queryByText('10 dager har blitt dekket')).not.toBeInTheDocument();
  });
});
