import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import {
  k9_kodeverk_behandling_BehandlingÅrsakType as BehandlingÅrsakDtoBehandlingArsakType,
  k9_kodeverk_behandling_FagsakYtelseType as fagsakYtelseType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { behandlingType as BehandlingTypeK9Sak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { behandlingÅrsakType as tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/BehandlingÅrsakType.js';
import { ung_kodeverk_behandling_BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, userEvent } from 'storybook/test';
import withFeatureToggles from '../../../storybook/decorators/withFeatureToggles.js';
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
    gyldigePerioderPerÅrsak: [
      {
        årsak: ung_kodeverk_behandling_BehandlingÅrsakType.RE_KONTROLL_REGISTER_INNTEKT,
        perioder: [
          { fom: '2025-01-01', tom: '2025-01-31' },
          { fom: '2025-02-01', tom: '2025-02-28' },
        ],
      },
    ],
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

export const modalForUngdomsprogramytelse: StoryObj<typeof MenyNyBehandlingIndexV2> = {
  args: {
    ...Default.args,
    ytelseType: fagsakYtelseType.UNGDOMSYTELSE,
    revurderingArsaker: [
      {
        kode: ung_kodeverk_behandling_BehandlingÅrsakType.RE_KONTROLL_REGISTER_INNTEKT,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Kontroll register inntekt',
      },
    ],
  },
};

export const delvisRevurderingV2: StoryObj<typeof MenyNyBehandlingIndexV2> = {
  decorators: [withFeatureToggles({ REVURDERING_FRA_STEG_V2: true })],
  args: {
    ...Default.args,
    delvisRevurderingsårsaker: [
      { årsak: BehandlingÅrsakDtoBehandlingArsakType.RE_ENDRING_BEREGNINGSGRUNNLAG as string, vilkårType: 'FP_VK_41' },
      { årsak: BehandlingÅrsakDtoBehandlingArsakType.RE_ENDRET_FORDELING as string, vilkårType: 'FP_VK_41' },
      { årsak: BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_MEDLEMSKAP as string, vilkårType: 'FP_VK_2' },
      { årsak: BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_SØKERS_REL as string, vilkårType: 'K9_VK_1' },
      { årsak: BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_OPPTJENING as string, vilkårType: 'FP_VK_23' },
    ],
    revurderingArsaker: [
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_KLAGE_UTEN_END_INNTEKT as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Klage uten inntekt',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Nye opplysninger om beregningsgrunnlag',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_ENDRING_BEREGNINGSGRUNNLAG as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Endring i beregningsgrunnlag',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_ENDRET_FORDELING as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Endret fordeling',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_MEDLEMSKAP as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Nye opplysninger om medlemskap',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_SØKERS_REL as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Nye opplysninger om søkers relasjon til barnet',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_OPPTJENING as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Nye opplysninger om opptjening',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_FEIL_I_LOVANDVENDELSE ?? '',
        kodeverk: 'ARSAK',
        navn: 'Feil i lovanvendelse',
      },
      {
        kode: BehandlingÅrsakDtoBehandlingArsakType.RE_ANNET as string,
        kodeverk: 'BEHANDLING_ARSAK_TYPE',
        navn: 'Annet',
      },
    ],
  },
  play: async ({ canvas, step }) => {
    await step('skal vise modus-velger når revurdering er valgt', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        'BT-004',
      );
      await expect(
        await canvas.findByRole('combobox', { name: 'Hvordan vil du opprette revurderingen?' }),
      ).toBeInTheDocument();
    });
    await step('skal vise årsak-velger og vilkår-info ved delvis revurdering', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        'BT-004',
      );
      const revurderingModus = await canvas.findByRole('combobox', {
        name: 'Hvordan vil du opprette revurderingen?',
      });
      await userEvent.selectOptions(revurderingModus, 'DELVIS');
      await expect(
        await canvas.findByRole('combobox', { name: 'Hva er årsaken til revurderingen?' }),
      ).toBeInTheDocument();
    });
    await step('skal vise vilkår og datovelgere når årsak er valgt', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        'BT-004',
      );
      await userEvent.selectOptions(
        await canvas.findByRole('combobox', { name: 'Hvordan vil du opprette revurderingen?' }),
        'DELVIS',
      );
      await userEvent.selectOptions(
        await canvas.findByRole('combobox', { name: 'Hva er årsaken til revurderingen?' }),
        BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_OPPTJENING,
      );
      const alert = await canvas.findByRole('alert');
      await expect(alert).toHaveTextContent('Vilkår som revurderes: Opptjeningsvilkåret');
      await expect(await canvas.findByRole('textbox', { name: 'Fra og med' })).toBeInTheDocument();
      await expect(await canvas.findByRole('textbox', { name: 'Til og med' })).toBeInTheDocument();
    });
    await step('skal vise årsak-dropdown med full revurdering', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hva slags behandling ønsker du å opprette?' }),
        'BT-004',
      );
      await userEvent.selectOptions(
        await canvas.findByRole('combobox', { name: 'Hvordan vil du opprette revurderingen?' }),
        'FULL',
      );
      await expect(
        await canvas.findByRole('combobox', { name: 'Hva er årsaken til den nye behandlingen?' }),
      ).toBeInTheDocument();
    });
  },
};
