import { k9_kodeverk_behandling_FagsakYtelseType as fagsakYtelseType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_kodeverk_behandling_BehandlingÅrsakType as BehandlingÅrsakType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { behandlingType as BehandlingTypeK9Sak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeatureTogglesContext from '../../../featuretoggles/FeatureTogglesContext';
import { qFeatureToggles } from '../../../featuretoggles/k9/featureToggles';
import MenyNyBehandlingIndexV2 from './MenyNyBehandlingIndex';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('<MenyNyBehandlingIndex>', () => {
  it('skal vise modal og så lage ny behandling', async () => {
    const lagNyBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());
    const lukkModalCallback = vi.fn();

    const behandlingOppretting = [
      {
        behandlingType: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        kanOppretteBehandling: true,
      },
      {
        behandlingType: BehandlingTypeK9Sak.REVURDERING,
        kanOppretteBehandling: true,
      },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <MenyNyBehandlingIndexV2
          ytelseType={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
          saksnummer="123"
          behandlingId={3}
          behandlingType={BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD}
          lagNyBehandling={lagNyBehandlingCallback}
          behandlingOppretting={behandlingOppretting}
          behandlingstyper={[
            {
              kode: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
              kodeverk: 'BEHANDLING_TYPE',
              navn: 'Førstegangssøknad',
            },
          ]}
          tilbakekrevingRevurderingArsaker={[]}
          revurderingArsaker={[
            {
              kode: BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
              kodeverk: 'BEHANDLING_AARSAK',
              navn: 'Opplysninger om beregningsgrunnlag',
            },
          ]}
          kanTilbakekrevingOpprettes={{
            kanBehandlingOpprettes: false,
            kanRevurderingOpprettes: false,
          }}
          uuidForSistLukkede="2323"
          erTilbakekrevingAktivert
          sjekkOmTilbakekrevingKanOpprettes={vi.fn()}
          sjekkOmTilbakekrevingRevurderingKanOpprettes={vi.fn()}
          lukkModal={lukkModalCallback}
        />
      </QueryClientProvider>,
    );
    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'BT-002');
      await userEvent.click(screen.getByRole('button', { name: 'Opprett behandling' }));
    });

    const kall = lagNyBehandlingCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]).toHaveLength(2);
    expect(kall[0]?.[0]).toBe('BT-002');
    expect(kall[0]?.[1]).toEqual({
      eksternUuid: '2323',
      saksnummer: '123',
      behandlingType: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
      fagsakYtelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    });

    expect(lukkModalCallback.mock.calls).toHaveLength(1);
  });

  it('skal bruke gammel full-revurdering-payload når REVURDERING_FRA_STEG_V2 er av', async () => {
    const lagNyBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());

    render(
      <QueryClientProvider client={queryClient}>
        <MenyNyBehandlingIndexV2
          ytelseType={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
          saksnummer="123"
          behandlingId={3}
          behandlingType={BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD}
          lagNyBehandling={lagNyBehandlingCallback}
          behandlingOppretting={[
            {
              behandlingType: BehandlingTypeK9Sak.REVURDERING,
              kanOppretteBehandling: true,
            },
          ]}
          behandlingstyper={[
            {
              kode: BehandlingTypeK9Sak.REVURDERING,
              kodeverk: 'BEHANDLING_TYPE',
              navn: 'Revurdering',
            },
          ]}
          tilbakekrevingRevurderingArsaker={[]}
          revurderingArsaker={[
            {
              kode: BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
              kodeverk: 'BEHANDLING_AARSAK',
              navn: 'Opplysninger om beregningsgrunnlag',
            },
          ]}
          kanTilbakekrevingOpprettes={{
            kanBehandlingOpprettes: false,
            kanRevurderingOpprettes: false,
          }}
          uuidForSistLukkede="2323"
          erTilbakekrevingAktivert
          sjekkOmTilbakekrevingKanOpprettes={vi.fn()}
          sjekkOmTilbakekrevingRevurderingKanOpprettes={vi.fn()}
          lukkModal={vi.fn()}
        />
      </QueryClientProvider>,
    );

    await act(async () => {
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        BehandlingTypeK9Sak.REVURDERING,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hvor i prosessen vil du starte revurderingen?' }),
        'inngangsvilkår',
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hva er årsaken til den nye behandlingen?' }),
        BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Opprett behandling' }));
    });

    const kall = lagNyBehandlingCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]?.[0]).toBe(BehandlingTypeK9Sak.REVURDERING);
    expect(kall[0]?.[1]).toEqual({
      behandlingType: BehandlingTypeK9Sak.REVURDERING,
      behandlingArsakType: BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
      eksternUuid: '2323',
      fagsakYtelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      saksnummer: '123',
    });
  });

  it('skal bruke gammel delvis-revurdering-payload når REVURDERING_FRA_STEG_V2 er av', async () => {
    const lagNyBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());

    render(
      <QueryClientProvider client={queryClient}>
        <MenyNyBehandlingIndexV2
          ytelseType={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
          saksnummer="123"
          behandlingId={3}
          behandlingType={BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD}
          lagNyBehandling={lagNyBehandlingCallback}
          behandlingOppretting={[
            {
              behandlingType: BehandlingTypeK9Sak.REVURDERING,
              kanOppretteBehandling: true,
            },
          ]}
          behandlingstyper={[
            {
              kode: BehandlingTypeK9Sak.REVURDERING,
              kodeverk: 'BEHANDLING_TYPE',
              navn: 'Revurdering',
            },
          ]}
          tilbakekrevingRevurderingArsaker={[]}
          revurderingArsaker={[]}
          kanTilbakekrevingOpprettes={{
            kanBehandlingOpprettes: false,
            kanRevurderingOpprettes: false,
          }}
          uuidForSistLukkede="2323"
          erTilbakekrevingAktivert
          sjekkOmTilbakekrevingKanOpprettes={vi.fn()}
          sjekkOmTilbakekrevingRevurderingKanOpprettes={vi.fn()}
          lukkModal={vi.fn()}
        />
      </QueryClientProvider>,
    );

    await act(async () => {
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        BehandlingTypeK9Sak.REVURDERING,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hvor i prosessen vil du starte revurderingen?' }),
        'RE-ENDRET-FORDELING',
      );
      await userEvent.type(screen.getByRole('textbox', { name: 'Fra og med' }), '01.03.2026');
      await userEvent.type(screen.getByRole('textbox', { name: 'Til og med' }), '10.03.2026');
      await userEvent.click(screen.getByRole('button', { name: 'Opprett behandling' }));
    });

    const kall = lagNyBehandlingCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]?.[0]).toBe(BehandlingTypeK9Sak.REVURDERING);
    expect(kall[0]?.[1]).toEqual({
      behandlingType: BehandlingTypeK9Sak.REVURDERING,
      eksternUuid: '2323',
      fagsakYtelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      fom: '2026-03-01',
      saksnummer: '123',
      steg: 'RE-ENDRET-FORDELING',
      tom: '2026-03-10',
    });
  });

  it('skal sende valgte perioder for delvis revurdering i ny flyt', async () => {
    const lagNyBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());
    const lukkModalCallback = vi.fn();

    render(
      <FeatureTogglesContext.Provider value={qFeatureToggles}>
        <QueryClientProvider client={queryClient}>
          <MenyNyBehandlingIndexV2
            ytelseType={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
            saksnummer="123"
            behandlingId={3}
            behandlingType={BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD}
            lagNyBehandling={lagNyBehandlingCallback}
            behandlingOppretting={[
              {
                behandlingType: BehandlingTypeK9Sak.REVURDERING,
                kanOppretteBehandling: true,
              },
            ]}
            delvisRevurderingsårsaker={[
              {
                årsak: BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
                vilkårType: 'FP_VK_41',
                periodeType: 'STP',
                valgbarePerioder: [
                  { fom: '2026-01-01', tom: '2026-01-31' },
                  { fom: '2026-02-01', tom: '2026-02-28' },
                ],
              },
            ]}
            behandlingstyper={[
              {
                kode: BehandlingTypeK9Sak.REVURDERING,
                kodeverk: 'BEHANDLING_TYPE',
                navn: 'Revurdering',
              },
            ]}
            tilbakekrevingRevurderingArsaker={[]}
            revurderingArsaker={[
              {
                kode: BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
                kodeverk: 'BEHANDLING_AARSAK',
                navn: 'Opplysninger om beregningsgrunnlag',
              },
            ]}
            kanTilbakekrevingOpprettes={{
              kanBehandlingOpprettes: false,
              kanRevurderingOpprettes: false,
            }}
            uuidForSistLukkede="2323"
            erTilbakekrevingAktivert
            sjekkOmTilbakekrevingKanOpprettes={vi.fn()}
            sjekkOmTilbakekrevingRevurderingKanOpprettes={vi.fn()}
            lukkModal={lukkModalCallback}
          />
        </QueryClientProvider>
      </FeatureTogglesContext.Provider>,
    );

    await act(async () => {
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        BehandlingTypeK9Sak.REVURDERING,
      );
      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Hvordan vil du opprette revurderingen?' }), 'DELVIS');
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hva er årsaken til revurderingen?' }),
        BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
      );
      await userEvent.click(screen.getByRole('checkbox', { name: 'Skjæringstidspunkt 01.01.2026' }));
      await userEvent.click(screen.getByRole('button', { name: 'Opprett behandling' }));
    });

    const kall = lagNyBehandlingCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]?.[0]).toBe(BehandlingTypeK9Sak.REVURDERING);
    expect(kall[0]?.[1]).toEqual({
      behandlingType: BehandlingTypeK9Sak.REVURDERING,
      eksternUuid: '2323',
      fagsakYtelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      perioder: [{ fom: '2026-01-01', tom: '2026-01-31' }],
      saksnummer: '123',
      steg: BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
    });
    expect(lukkModalCallback.mock.calls).toHaveLength(1);
  });

  it('skal bruke datepicker-flyt for RE_ENDRET_FORDELING', async () => {
    const lagNyBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());
    const lukkModalCallback = vi.fn();

    render(
      <FeatureTogglesContext.Provider value={qFeatureToggles}>
        <QueryClientProvider client={queryClient}>
          <MenyNyBehandlingIndexV2
            ytelseType={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
            saksnummer="123"
            behandlingId={3}
            behandlingType={BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD}
            lagNyBehandling={lagNyBehandlingCallback}
            behandlingOppretting={[
              {
                behandlingType: BehandlingTypeK9Sak.REVURDERING,
                kanOppretteBehandling: true,
              },
            ]}
            delvisRevurderingsårsaker={[
              {
                årsak: BehandlingÅrsakType.RE_ENDRING_BEREGNINGSGRUNNLAG,
                vilkårType: 'FP_VK_41',
                periodeType: 'STP',
                valgbarePerioder: [{ fom: '2026-03-01', tom: '2026-03-01' }],
              },
              {
                årsak: BehandlingÅrsakType.RE_ENDRET_FORDELING,
                vilkårType: 'FP_VK_41',
                periodeType: 'PERIODE',
                valgbarePerioder: [],
              },
            ]}
            behandlingstyper={[
              {
                kode: BehandlingTypeK9Sak.REVURDERING,
                kodeverk: 'BEHANDLING_TYPE',
                navn: 'Revurdering',
              },
            ]}
            tilbakekrevingRevurderingArsaker={[]}
            revurderingArsaker={[
              {
                kode: BehandlingÅrsakType.RE_ENDRING_BEREGNINGSGRUNNLAG,
                kodeverk: 'BEHANDLING_AARSAK',
                navn: 'Endring beregningsgrunnlag',
              },
              {
                kode: BehandlingÅrsakType.RE_ENDRET_FORDELING,
                kodeverk: 'BEHANDLING_AARSAK',
                navn: 'Omfordeling',
              },
            ]}
            kanTilbakekrevingOpprettes={{
              kanBehandlingOpprettes: false,
              kanRevurderingOpprettes: false,
            }}
            uuidForSistLukkede="2323"
            erTilbakekrevingAktivert
            sjekkOmTilbakekrevingKanOpprettes={vi.fn()}
            sjekkOmTilbakekrevingRevurderingKanOpprettes={vi.fn()}
            lukkModal={lukkModalCallback}
          />
        </QueryClientProvider>
      </FeatureTogglesContext.Provider>,
    );

    await act(async () => {
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        BehandlingTypeK9Sak.REVURDERING,
      );
      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Hvordan vil du opprette revurderingen?' }), 'DELVIS');
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hva er årsaken til revurderingen?' }),
        BehandlingÅrsakType.RE_ENDRET_FORDELING,
      );
      await userEvent.type(screen.getByRole('textbox', { name: 'Fra og med' }), '01.03.2026');
      await userEvent.type(screen.getByRole('textbox', { name: 'Til og med' }), '01.03.2026');
      await userEvent.click(screen.getByRole('button', { name: 'Opprett behandling' }));
    });

    const kall = lagNyBehandlingCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]?.[0]).toBe(BehandlingTypeK9Sak.REVURDERING);
    expect(kall[0]?.[1]).toEqual({
      behandlingType: BehandlingTypeK9Sak.REVURDERING,
      eksternUuid: '2323',
      fagsakYtelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      fom: '2026-03-01',
      saksnummer: '123',
      steg: BehandlingÅrsakType.RE_ENDRET_FORDELING,
      tom: '2026-03-01',
    });
    expect(lukkModalCallback.mock.calls).toHaveLength(1);
  });

  it('skal bruke full-whitelist for delvis og filtrere bort RE_ENDRING_BEREGNINGSGRUNNLAG', async () => {
    const lagNyBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());

    render(
      <FeatureTogglesContext.Provider value={qFeatureToggles}>
        <QueryClientProvider client={queryClient}>
          <MenyNyBehandlingIndexV2
            ytelseType={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
            saksnummer="123"
            behandlingId={3}
            behandlingType={BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD}
            lagNyBehandling={lagNyBehandlingCallback}
            behandlingOppretting={[
              {
                behandlingType: BehandlingTypeK9Sak.REVURDERING,
                kanOppretteBehandling: true,
              },
            ]}
            delvisRevurderingsårsaker={[
              {
                årsak: BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
                vilkårType: 'FP_VK_41',
                periodeType: 'STP',
                valgbarePerioder: [{ fom: '2026-03-01', tom: '2026-03-01' }],
              },
              {
                årsak: BehandlingÅrsakType.RE_ENDRING_BEREGNINGSGRUNNLAG,
                vilkårType: 'FP_VK_41',
                periodeType: 'STP',
                valgbarePerioder: [{ fom: '2026-04-01', tom: '2026-04-01' }],
              },
            ]}
            behandlingstyper={[
              {
                kode: BehandlingTypeK9Sak.REVURDERING,
                kodeverk: 'BEHANDLING_TYPE',
                navn: 'Revurdering',
              },
            ]}
            tilbakekrevingRevurderingArsaker={[]}
            revurderingArsaker={[
              {
                kode: BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
                kodeverk: 'BEHANDLING_AARSAK',
                navn: 'Nye opplysninger som kan påvirke beregningsgrunnlaget',
              },
              {
                kode: BehandlingÅrsakType.RE_ENDRING_BEREGNINGSGRUNNLAG,
                kodeverk: 'BEHANDLING_AARSAK',
                navn: 'Nye opplysninger som kan påvirke beregningsgrunnlaget',
              },
            ]}
            kanTilbakekrevingOpprettes={{
              kanBehandlingOpprettes: false,
              kanRevurderingOpprettes: false,
            }}
            uuidForSistLukkede="2323"
            erTilbakekrevingAktivert
            sjekkOmTilbakekrevingKanOpprettes={vi.fn()}
            sjekkOmTilbakekrevingRevurderingKanOpprettes={vi.fn()}
            lukkModal={vi.fn()}
          />
        </QueryClientProvider>
      </FeatureTogglesContext.Provider>,
    );

    await act(async () => {
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        BehandlingTypeK9Sak.REVURDERING,
      );
      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Hvordan vil du opprette revurderingen?' }), 'DELVIS');
    });

    const årsakSelect = screen.getByRole('combobox', { name: 'Hva er årsaken til revurderingen?' });
    const options = Array.from(årsakSelect.querySelectorAll('option')).map(o => ({
      value: o.value,
      label: o.textContent?.trim(),
    }));

    expect(options.some(o => o.value === BehandlingÅrsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG)).toBe(true);
    expect(options.some(o => o.value === BehandlingÅrsakType.RE_ENDRING_BEREGNINGSGRUNNLAG)).toBe(false);
  });
});
