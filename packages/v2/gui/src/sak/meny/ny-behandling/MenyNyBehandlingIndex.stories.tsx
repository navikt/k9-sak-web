import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import {
  k9_kodeverk_behandling_BehandlingÅrsakType as BehandlingÅrsakDtoBehandlingArsakType,
  k9_kodeverk_behandling_FagsakYtelseType as fagsakYtelseType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { behandlingType as BehandlingTypeK9Sak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { behandlingÅrsakType as tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/BehandlingÅrsakType.js';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, userEvent } from 'storybook/test';
import MenyNyBehandlingIndexV2 from './MenyNyBehandlingIndex';

export default {
  title: 'gui/sak/meny/ny-behandling',
  component: MenyNyBehandlingIndexV2,
} satisfies Meta<typeof MenyNyBehandlingIndexV2>;

const behandlingstyper = [
  {
    kode: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
    kodeverk: 'BEHANDLING_TYPE',
    navn: 'Førstegangssøknad',
  },
  {
    kode: BehandlingTypeK9Sak.REVURDERING,
    kodeverk: 'BEHANDLING_TYPE',
    navn: 'Revurdering',
  },
  {
    kode: BehandlingTypeK9Klage.KLAGE,
    kodeverk: 'BEHANDLING_TYPE',
    navn: 'Klage',
  },
  {
    kode: BehandlingTypeK9Klage.TILBAKEKREVING,
    kodeverk: 'BEHANDLING_TYPE',
    navn: 'Tilbakekreving',
  },
  {
    kode: BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING,
    kodeverk: 'BEHANDLING_TYPE',
    navn: 'Tilbakekreving revurdering',
  },
];

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

export const Default: StoryObj<typeof MenyNyBehandlingIndexV2> = {
  args: {
    ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    saksnummer: '123',
    behandlingId: 1,
    behandlingType: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
    lagNyBehandling: action('button-click'),
    behandlingstyper: behandlingstyper,
    tilbakekrevingRevurderingArsaker: [],
    revurderingArsaker: [
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_KLAGE_UTEN_END_INNTEKT as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Klage uten inntekt',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Beregningsgrunnlag',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_FEIL_I_LOVANDVENDELSE ?? '',
        navn: 'FEIL_I_LOVANDVENDELSE',
        kodeverk: 'ARSAK',
      },
    ],
    behandlingOppretting: behandlingOppretting,
    kanTilbakekrevingOpprettes: {
      kanBehandlingOpprettes: false,
      kanRevurderingOpprettes: false,
    },
    erTilbakekrevingAktivert: false,
    sjekkOmTilbakekrevingKanOpprettes: action('button-click'),
    sjekkOmTilbakekrevingRevurderingKanOpprettes: action('button-click'),
    lukkModal: action('button-click'),
  },
  play: async ({ canvas, step }) => {
    await step('skal rendre komponent korrekt', async () => {
      await expect(canvas.getByRole('dialog', { name: 'Ny behandling' })).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Opprett behandling' })).toBeInTheDocument();
      await expect(canvas.getAllByRole('combobox').length).toBe(1);
    });
    await step('skal vise checkbox for behandling etter klage når førstegangsbehandling er valgt', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        'BT-002',
      );
      await expect(
        canvas.getByRole('checkbox', { name: 'Behandlingen opprettes som et resultat av klagebehandling' }),
      ).toBeInTheDocument();
    });
    await step('skal vise dropdown for revurderingsårsaker når revurdering er valgt', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        'BT-004',
      );
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hvor i prosessen vil du starte revurderingen?' }),
        'inngangsvilkår',
      );
      await expect(canvas.getAllByRole('combobox').length).toBe(3);
      await expect(canvas.getByRole('option', { name: 'Revurderingsbehandling' })).toBeInTheDocument();
      await expect(canvas.getByRole('option', { name: 'Fra inngangsvilkår (full revurdering)' })).toBeInTheDocument();
      await expect(
        canvas.getByRole('option', { name: 'Fra uttak, refusjon og fordeling-steget (delvis revurdering)' }),
      ).toBeInTheDocument();
      await expect(canvas.getByRole('option', { name: 'FEIL_I_LOVANDVENDELSE' })).toBeInTheDocument();
    });
    await step('skal rendre fra- og til-dato når revurdering fra uttakssteg er valgt', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        'BT-004',
      );
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hvor i prosessen vil du starte revurderingen?' }),
        'RE-ENDRET-FORDELING',
      );
      await expect(canvas.getByRole('textbox', { name: 'Fra og med' })).toBeInTheDocument();
      await expect(canvas.getByRole('textbox', { name: 'Til og med' })).toBeInTheDocument();
    });
  },
};

export const visMenyForÅLageNyTilbakekrevingsbehandling = () => (
  <MenyNyBehandlingIndexV2
    ytelseType={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
    saksnummer="123"
    behandlingId={1}
    behandlingType={BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD}
    lagNyBehandling={action('button-click')}
    behandlingstyper={behandlingstyper}
    tilbakekrevingRevurderingArsaker={[
      {
        kode: tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType.RE_KLAGE_KA,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Klage KA',
      },
      {
        kode: tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType.RE_KLAGE_NFP,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Klage NFP',
      },
    ]}
    revurderingArsaker={[
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_KLAGE_UTEN_END_INNTEKT as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Klage uten inntekt',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Beregningsgrunnlag',
      },
    ]}
    behandlingOppretting={behandlingOppretting}
    kanTilbakekrevingOpprettes={{
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: true,
    }}
    erTilbakekrevingAktivert
    sjekkOmTilbakekrevingKanOpprettes={action('button-click')}
    sjekkOmTilbakekrevingRevurderingKanOpprettes={action('button-click')}
    lukkModal={action('button-click')}
  />
);
