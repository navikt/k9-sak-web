import { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import { behandlingÅrsakType as tilbakekrevingBehandlingÅrsakType } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/BehandlingÅrsakType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import type { BehandlingOppretting } from './NyBehandlingModal.js';
import { NyBehandlingModalAktivitetspenger } from './NyBehandlingModalAktivitetspenger.js';

const BEHANDLING_TYPE_FØRSTEGANGSSØKNAD = 'BT-002';

const behandlingstyper = [
  { kode: BEHANDLING_TYPE_FØRSTEGANGSSØKNAD, kodeverk: 'BEHANDLING_TYPE', navn: 'Førstegangssøknad' },
  { kode: BehandlingType.REVURDERING, kodeverk: 'BEHANDLING_TYPE', navn: 'Revurdering' },
  { kode: BehandlingType.TILBAKEKREVING, kodeverk: 'BEHANDLING_TYPE', navn: 'Tilbakekreving' },
  { kode: BehandlingType.REVURDERING_TILBAKEKREVING, kodeverk: 'BEHANDLING_TYPE', navn: 'Tilbakekreving revurdering' },
];

const behandlingOppretting: BehandlingOppretting[] = [
  { behandlingType: BEHANDLING_TYPE_FØRSTEGANGSSØKNAD, kanOppretteBehandling: true },
  {
    behandlingType: BehandlingType.REVURDERING,
    kanOppretteBehandling: true,
    gyldigePerioderPerÅrsak: [{ årsak: 'ENDRET-BOSTED', perioder: [] }],
  },
];

const meta = {
  title: 'gui/sak/meny/ny-behandling/NyBehandlingModalAktivitetspenger.tsx',
  component: NyBehandlingModalAktivitetspenger,
  args: {
    behandlingstyper,
    behandlingOppretting,
    tilbakekrevingRevurderingArsaker: [
      {
        kode: tilbakekrevingBehandlingÅrsakType.RE_KLAGE_KA,
        kodeverk: 'BEHANDLING_AARSAK',
        navn: 'Klage tilbakekreving (KA)',
      },
      {
        kode: tilbakekrevingBehandlingÅrsakType.RE_OPPLYSNINGER_OM_VILKÅR,
        kodeverk: 'BEHANDLING_AARSAK',
        navn: 'Nye opplysninger om vilkårsvurdering',
      },
    ],
    kanTilbakekrevingOpprettes: { kanBehandlingOpprettes: true, kanRevurderingOpprettes: true },
    saksnummer: '123',
    behandlingUuid: 'uuid-123',
    uuidForSistLukkede: 'uuid-lukket',
    erTilbakekrevingAktivert: true,
    cancelEvent: fn(),
    submitCallback: fn(),
    sjekkOmTilbakekrevingKanOpprettes: fn(),
    sjekkOmTilbakekrevingRevurderingKanOpprettes: fn(),
  },
} satisfies Meta<typeof NyBehandlingModalAktivitetspenger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {};

export const OpprettFørstegangsbehandling: Story = {
  play: async ({ canvas, args, step }) => {
    await step('Velg behandlingstype og send inn', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        BEHANDLING_TYPE_FØRSTEGANGSSØKNAD,
      );
      await userEvent.click(canvas.getByRole('button', { name: 'Opprett behandling' }));
    });

    await expect(args.submitCallback).toHaveBeenCalledWith({
      behandlingType: BEHANDLING_TYPE_FØRSTEGANGSSØKNAD,
      behandlingArsakType: undefined,
      behandlingUuid: 'uuid-123',
      eksternUuid: 'uuid-lukket',
      fagsakYtelseType: 'AKT',
    });
  },
};

export const OpprettRevurdering: Story = {
  play: async ({ canvas, args, step }) => {
    await step('Velg revurdering og vilkår, send inn', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        BehandlingType.REVURDERING,
      );
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Vilkår som skal føre til opphør eller avslag' }),
        'ENDRET-BOSTED',
      );
      await userEvent.click(canvas.getByRole('button', { name: 'Opprett behandling' }));
    });

    await expect(args.submitCallback).toHaveBeenCalledWith({
      behandlingType: BehandlingType.REVURDERING,
      behandlingArsakType: 'ENDRET-BOSTED',
      behandlingUuid: 'uuid-123',
      eksternUuid: 'uuid-lukket',
      fagsakYtelseType: 'AKT',
    });
  },
};

export const OpprettTilbakekreving: Story = {
  play: async ({ canvas, args, step }) => {
    await step('Velg tilbakekreving og send inn', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        BehandlingType.TILBAKEKREVING,
      );
      await userEvent.click(canvas.getByRole('button', { name: 'Opprett behandling' }));
    });

    await expect(args.submitCallback).toHaveBeenCalledWith({
      behandlingType: BehandlingType.TILBAKEKREVING,
      behandlingArsakType: undefined,
      behandlingUuid: 'uuid-123',
      eksternUuid: 'uuid-lukket',
      fagsakYtelseType: 'AKT',
    });
  },
};

export const OpprettTilbakekrevingRevurdering: Story = {
  play: async ({ canvas, args, step }) => {
    await step('Velg tilbakekreving revurdering og årsak, send inn', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        BehandlingType.REVURDERING_TILBAKEKREVING,
      );
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva er årsaken til revurderingen?' }),
        tilbakekrevingBehandlingÅrsakType.RE_KLAGE_KA,
      );
      await userEvent.click(canvas.getByRole('button', { name: 'Opprett behandling' }));
    });

    await expect(args.submitCallback).toHaveBeenCalledWith({
      behandlingType: BehandlingType.REVURDERING_TILBAKEKREVING,
      behandlingArsakType: tilbakekrevingBehandlingÅrsakType.RE_KLAGE_KA,
      behandlingUuid: 'uuid-123',
      eksternUuid: 'uuid-lukket',
      fagsakYtelseType: 'AKT',
    });
  },
};

export const KallerTilbakekrevingSjekk: Story = {
  play: async ({ args }) => {
    await expect(args.sjekkOmTilbakekrevingKanOpprettes).toHaveBeenCalledWith({
      saksnummer: '123',
      ytelsesbehandlingUuid: 'uuid-lukket',
      uuid: 'uuid-lukket',
    });
  },
};

export const KallerTilbakekrevingRevurderingSjekk: Story = {
  args: {
    behandlingType: BehandlingType.TILBAKEKREVING,
    behandlingUuid: 'uuid-tilbake',
  },
  play: async ({ args }) => {
    await expect(args.sjekkOmTilbakekrevingRevurderingKanOpprettes).toHaveBeenCalledWith({
      behandlingUuid: 'uuid-tilbake',
      uuid: 'uuid-tilbake',
    });
  },
};

export const AvbrytLukkerModal: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Avbryt' }));
    await expect(args.cancelEvent).toHaveBeenCalledTimes(1);
  },
};
