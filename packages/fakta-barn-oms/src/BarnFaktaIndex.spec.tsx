import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { BarnType } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import messages from '../i18n/nb_NO.json';
import BarnFaktaIndex from './BarnFaktaIndex';

const renderBarnFaktaIndex = (props: React.ComponentProps<typeof BarnFaktaIndex>) =>
  renderWithIntl(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <BarnFaktaIndex {...props} />
    </QueryClientProvider>,
    { messages },
  );

describe('<BarnFaktaIndex>', () => {
  it('henter barn og rammevedtak og viderefører til BarnFakta', async () => {
    const hentBarnOgRammevedtak = vi.fn().mockResolvedValue({
      barn: [{ personIdent: '123', barnType: BarnType.VANLIG }],
      rammevedtak: [],
    });

    renderBarnFaktaIndex({ behandlingUuid: 'test-behandling', hentBarnOgRammevedtak });

    expect(
      await screen.findByText(
        'Disse barna er søkerens folkeregistrerte barn slik det var ved tidspunktet for beregning av dager',
      ),
    ).toBeInTheDocument();
    expect(hentBarnOgRammevedtak).toHaveBeenCalledWith('test-behandling');
  });

  it('hvis ingen barn, rendres info om dette', async () => {
    const hentBarnOgRammevedtak = vi.fn().mockResolvedValue({ barn: [], rammevedtak: [] });

    renderBarnFaktaIndex({ behandlingUuid: 'test-behandling', hentBarnOgRammevedtak });

    expect(await screen.findByText('Det er ikke registrert noen barn på søkeren')).toBeInTheDocument();
  });
});
