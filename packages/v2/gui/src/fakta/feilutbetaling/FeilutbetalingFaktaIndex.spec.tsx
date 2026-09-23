import type { LegacyBekreftAksjonspunktCallback } from '@k9-sak-web/gui/utils/typehelp/AksjonspunktSubmitCallbackArgumentType.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { FeilutbetalingFaktaApi } from './api/FeilutbetalingFaktaApi.js';
import { FeilutbetalingFaktaApiContext } from './api/FeilutbetalingFaktaApiContext.js';
import type {
  FeilutbetalingFaktaViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './api/FeilutbetalingFaktaViewModel.js';
import FeilutbetalingFaktaIndex from './FeilutbetalingFaktaIndex.js';
import { FeilutbetalingKodeverkoppslagContext } from './FeilutbetalingKodeverkoppslagContext.js';

const faktaMedÅrsak = (
  hendelseType = 'PSB_ANNET_TYPE',
  hendelseUndertype = 'ANNET_FRITEKST',
): FeilutbetalingFaktaViewModel => ({
  behandlingFakta: {
    begrunnelse: 'Eksisterende begrunnelse',
    perioder: [
      {
        fom: '2024-01-01',
        tom: '2024-01-31',
        belop: 1000,
        feilutbetalingÅrsakDto: { hendelseType, hendelseUndertype },
      },
    ],
  },
});

const gyldigeÅrsaker: FeilutbetalingÅrsakerPerYtelseViewModel[] = [
  {
    ytelseType: 'PSB',
    hendelseTyper: [
      {
        hendelseType: 'PSB_ANNET_TYPE',
        hendelseUndertyper: ['ANNET_FRITEKST'],
      },
    ],
  },
];

const createApi = (
  fakta: FeilutbetalingFaktaViewModel,
  årsaker: FeilutbetalingÅrsakerPerYtelseViewModel[],
): FeilutbetalingFaktaApi => ({
  backend: 'k9tilbake',
  hentFeilutbetalingFakta: async () => fakta,
  hentFeilutbetalingÅrsaker: async () => årsaker,
});

const createSubmitCallback = () => vi.fn<LegacyBekreftAksjonspunktCallback>().mockResolvedValue(undefined);

const renderComponent = ({
  fakta = faktaMedÅrsak(),
  årsaker = gyldigeÅrsaker,
  submitCallback = createSubmitCallback(),
}: {
  fakta?: FeilutbetalingFaktaViewModel;
  årsaker?: FeilutbetalingÅrsakerPerYtelseViewModel[];
  submitCallback?: ReturnType<typeof createSubmitCallback>;
} = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={queryClient}>
      <FeilutbetalingFaktaApiContext value={createApi(fakta, årsaker)}>
        <FeilutbetalingKodeverkoppslagContext
          value={{
            hentHendelseTypeNavn: kode => kode ?? '',
            hentHendelseUnderTypeNavn: kode => kode ?? '',
            hentVidereBehandlingNavn: kode => kode ?? '',
          }}
        >
          <Suspense fallback={null}>
            <FeilutbetalingFaktaIndex
              behandlingUuid="behandling-uuid"
              behandlingVersjon={1}
              fagsakYtelseType="PSB"
              readOnly={false}
              hasOpenAksjonspunkter
              submitCallback={submitCallback}
            />
          </Suspense>
        </FeilutbetalingKodeverkoppslagContext>
      </FeilutbetalingFaktaApiContext>
    </QueryClientProvider>,
  );

  return { submitCallback };
};

const oppdaterBegrunnelse = async (user: ReturnType<typeof userEvent.setup>) => {
  const begrunnelse = await screen.findByRole('textbox', { name: 'Forklar årsaken(e) til feilutbetalingen' });
  await user.clear(begrunnelse);
  await user.type(begrunnelse, 'Oppdatert begrunnelse');
};

const submit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /Bekreft og fortsett/ }));
};

describe('FeilutbetalingFaktaIndex', () => {
  it('sender komplett årsak gjennom den eksisterende 7003-callbacken', async () => {
    const user = userEvent.setup();
    const { submitCallback } = renderComponent();

    await oppdaterBegrunnelse(user);
    await submit(user);

    await waitFor(() =>
      expect(submitCallback).toHaveBeenCalledWith([
        {
          kode: '7003',
          begrunnelse: 'Oppdatert begrunnelse',
          feilutbetalingFakta: [
            {
              fom: '2024-01-01',
              tom: '2024-01-31',
              årsak: {
                hendelseType: 'PSB_ANNET_TYPE',
                hendelseUndertype: 'ANNET_FRITEKST',
              },
            },
          ],
        },
      ]),
    );
  });

  it('stopper lagring når den forhåndsvalgte årsaken mangler i ytelseskatalogen', async () => {
    const user = userEvent.setup();
    const { submitCallback } = renderComponent({ årsaker: [] });

    await oppdaterBegrunnelse(user);
    await submit(user);

    expect(await screen.findByText('Valgt hendelse er ikke tilgjengelig for denne ytelsen')).toBeInTheDocument();
    expect(submitCallback).not.toHaveBeenCalled();
  });

  it('stopper lagring når den forhåndsvalgte årsaken mangler i ytelsens katalog', async () => {
    const user = userEvent.setup();
    const { submitCallback } = renderComponent({
      årsaker: [
        {
          ytelseType: 'PSB',
          hendelseTyper: [{ hendelseType: 'MEDLEMSKAP', hendelseUndertyper: ['ANNEN_UNDERÅRSAK'] }],
        },
      ],
    });

    await oppdaterBegrunnelse(user);
    await submit(user);

    expect(await screen.findByText('Valgt hendelse er ikke tilgjengelig for denne ytelsen')).toBeInTheDocument();
    expect(submitCallback).not.toHaveBeenCalled();
  });

  it('stopper lagring når valgt hendelse ikke har en oppført underårsak', async () => {
    const user = userEvent.setup();
    const { submitCallback } = renderComponent({
      årsaker: [
        {
          ytelseType: 'PSB',
          hendelseTyper: [{ hendelseType: 'PSB_ANNET_TYPE', hendelseUndertyper: [] }],
        },
      ],
    });

    await oppdaterBegrunnelse(user);
    await submit(user);

    expect(await screen.findByText('Valgt hendelse mangler gyldige underårsaker')).toBeInTheDocument();
    expect(submitCallback).not.toHaveBeenCalled();
  });

  it('stopper lagring når den forhåndsvalgte underårsaken ikke finnes i katalogen', async () => {
    const user = userEvent.setup();
    const { submitCallback } = renderComponent({ fakta: faktaMedÅrsak('PSB_ANNET_TYPE', 'GAMMEL_UNDERÅRSAK') });

    await oppdaterBegrunnelse(user);
    await submit(user);

    expect(await screen.findByText('Valgt underårsak er ikke tilgjengelig for hendelsen')).toBeInTheDocument();
    expect(submitCallback).not.toHaveBeenCalled();
  });

  it('kan ikke sende inn på nytt mens callbacken venter', async () => {
    const user = userEvent.setup();
    let fullførLagring: (() => void) | undefined;
    const submitCallback = vi.fn<LegacyBekreftAksjonspunktCallback>().mockImplementation(
      () =>
        new Promise<void>(resolve => {
          fullførLagring = resolve;
        }),
    );
    renderComponent({ submitCallback });

    await oppdaterBegrunnelse(user);
    await submit(user);

    await waitFor(() => expect(submitCallback).toHaveBeenCalledTimes(1));
    const submitKnapp = screen.getByRole('button', { name: /Bekreft og fortsett/ });
    expect(submitKnapp).toBeDisabled();

    await user.click(submitKnapp);
    expect(submitCallback).toHaveBeenCalledTimes(1);

    fullførLagring?.();
    await waitFor(() => expect(submitKnapp).toBeEnabled());
  });
});
