import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import withK9Kodeverkoppslag from '../../../storybook/decorators/withK9Kodeverkoppslag';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import SykdomUperiodisertIndex from './SykdomUperiodisertIndex';
import SykdomOgOpplæringBackendClient from '../SykdomOgOpplæringBackendClient';
import {
  k9_kodeverk_vilkår_Avslagsårsak as Avslagsårsak,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_sykdom_LangvarigSykdomResultat as LangvarigSykdomResultat,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

const løsAksjonspunkt9300 = fn(action('løsAksjonspunkt9300'));
const løsAksjonspunkt9301 = fn(action('løsAksjonspunkt9301'));
const løsAksjonspunkt9302 = fn(action('løsAksjonspunkt9302'));
const løsAksjonspunkt9303 = fn(action('løsAksjonspunkt9303'));

const withSykdomOgOpplæringContext = (): Decorator => Story => {
  const sykdomOgOpplæringContextState = {
    readOnly: false,
    løsAksjonspunkt9300,
    løsAksjonspunkt9301,
    løsAksjonspunkt9302,
    løsAksjonspunkt9303,
    behandlingUuid: '222-3333',
    aksjonspunkter: [
      {
        definisjon: aksjonspunktCodes.VURDER_LANGVARIG_SYK,
        status: aksjonspunktStatus.OPPRETTET,
        kanLoses: true,
        erAktivt: true,
        toTrinnsBehandling: false,
      },
    ],
  };
  return (
    <SykdomOgOpplæringContext.Provider value={sykdomOgOpplæringContextState}>
      <Story />
    </SykdomOgOpplæringContext.Provider>
  );
};
const withMockDataIkkeVurdert: Decorator = Story => {
  // Mock list of uperiodiserte sykdomsvurderinger

  SykdomOgOpplæringBackendClient.prototype.hentLangvarigSykVurderingerFagsak = async () => [];
  SykdomOgOpplæringBackendClient.prototype.hentVurdertLangvarigSykdom = async () => ({
    vurderingUuid: '',
    resultat: LangvarigSykdomResultat.MÅ_VURDERES,
  });

  return <Story />;
};
const withMockData: Decorator = Story => {
  // Mock list of uperiodiserte sykdomsvurderinger
  const langvarigSykVurderingerMock = [
    {
      uuid: 'v1',
      vurdertTidspunkt: '2025-01-15T10:00:00Z',
      godkjent: true,
      vurderingFraAnnenpart: false,
      begrunnelse: 'Barnet har langvarig sykdom som krever opplæring',
      kanOppdateres: true,
      diagnosekoder: [],
      avslagsårsak: undefined,
      behandlingUuid: '222-3333',
      saksnummer: { saksnummer: '12345' },
      vurdertAv: 'Z123456',
    },
    {
      uuid: 'v2',
      vurdertTidspunkt: '2025-02-10T12:30:00Z',
      godkjent: false,
      avslagsårsak: Avslagsårsak.MANGLENDE_DOKUMENTASJON,
      vurderingFraAnnenpart: true,
      begrunnelse: 'Mangler dokumentasjon',
      kanOppdateres: true,
      diagnosekoder: [],
      behandlingUuid: '222-3333',
      saksnummer: { saksnummer: '12345' },
      vurdertAv: 'Z123456',
    },
  ];

  // Mock which vurdering is used by the aksjonspunkt
  const vurdertLangvarigSykdomMock = {
    vurderingUuid: 'v1',
    resultat: LangvarigSykdomResultat.GODKJENT,
  };

  SykdomOgOpplæringBackendClient.prototype.hentLangvarigSykVurderingerFagsak = async () => langvarigSykVurderingerMock;
  SykdomOgOpplæringBackendClient.prototype.hentVurdertLangvarigSykdom = async () => vurdertLangvarigSykdomMock;

  return <Story />;
};

const meta = {
  title: 'gui/fakta/sykdom-og-opplæring/2-sykdom',
  component: SykdomUperiodisertIndex,
  decorators: [withK9Kodeverkoppslag(), withSykdomOgOpplæringContext()],
} satisfies Meta<typeof SykdomUperiodisertIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withMockDataIkkeVurdert],
};

export const GodkjentMedDiagnoser: Story = {
  decorators: [withMockDataIkkeVurdert],
  play: async ({ canvas }) => {
    // Wait for form to appear
    const begrunnelseTextarea = await canvas.findByRole('textbox', {
      name: /Vurder om barnet har en funksjonshemning/i,
    });
    await userEvent.clear(begrunnelseTextarea);
    await userEvent.type(begrunnelseTextarea, 'Barnet har langvarig sykdom som krever spesiell opplæring av foreldre.');

    // Select "Ja"
    const radioGroup = canvas.getByRole('group', { name: /Har barnet en funksjonshemming eller langvarig sykdom/i });
    const jaRadio = within(radioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Diagnosekode field should be enabled
    const diagnosekodeInput = canvas.getByLabelText(/Hvilke diagnoser har barnet/i);
    await expect(diagnosekodeInput).toBeEnabled();

    // Add a diagnosis code - type to open menu and select first option
    await userEvent.type(diagnosekodeInput, 'A000');
    const diagnosisOption = await canvas.findByRole('option', { name: /A000/i });
    await userEvent.click(diagnosisOption);
    await userEvent.keyboard('{Escape}');

    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify
    await expect(løsAksjonspunkt9301).toHaveBeenCalledWith(undefined, {
      behandlingUuid: '222-3333',
      diagnoser: ['A000'],
      begrunnelse: 'Barnet har langvarig sykdom som krever spesiell opplæring av foreldre.',
      godkjent: true,
      avslagsårsak: undefined,
    });
  },
};

export const IkkeGodkjent: Story = {
  decorators: [withMockDataIkkeVurdert],
  play: async ({ canvas }) => {
    // Wait for form to appear
    const begrunnelseTextarea = await canvas.findByRole('textbox', {
      name: /Vurder om barnet har en funksjonshemning/i,
    });
    await userEvent.clear(begrunnelseTextarea);
    await userEvent.type(begrunnelseTextarea, 'Sykdommen er ikke langvarig nok til å oppfylle vilkåret.');

    // Select "Nei"
    const radioGroup = canvas.getByRole('group', { name: /Har barnet en funksjonshemming eller langvarig sykdom/i });
    const neiRadio = within(radioGroup).getByLabelText('Nei');
    await userEvent.click(neiRadio);

    // Diagnosekode field should be disabled
    const diagnosekodeInput = canvas.getByLabelText(/Hvilke diagnoser har barnet/i);
    await expect(diagnosekodeInput).toBeDisabled();

    // Submit - when there are multiple buttons, take the last one (form submit, not Alert)
    const submitButtons = canvas.getAllByRole('button', { name: /Bekreft og fortsett/i });
    const submitButton = submitButtons[submitButtons.length - 1]!;
    await userEvent.click(submitButton);

    // Verify
    await expect(løsAksjonspunkt9301).toHaveBeenCalledWith(undefined, {
      behandlingUuid: '222-3333',
      diagnoser: [],
      begrunnelse: 'Sykdommen er ikke langvarig nok til å oppfylle vilkåret.',
      godkjent: false,
      avslagsårsak: Avslagsårsak.IKKE_LANGVARIG_SYK,
    });
  },
};

export const ManglerDokumentasjon: Story = {
  decorators: [withMockDataIkkeVurdert],
  play: async ({ canvas }) => {
    // Wait for form to appear
    const begrunnelseTextarea = await canvas.findByRole('textbox', {
      name: /Vurder om barnet har en funksjonshemning/i,
    });
    await userEvent.clear(begrunnelseTextarea);
    await userEvent.type(begrunnelseTextarea, 'Vi mangler dokumentasjon på langvarig sykdom.');

    // Select "Mangler dokumentasjon"
    const radioGroup = canvas.getByRole('group', { name: /Har barnet en funksjonshemming eller langvarig sykdom/i });
    const manglerDokRadio = within(radioGroup).getByLabelText('Mangler dokumentasjon');
    await userEvent.click(manglerDokRadio);

    // Check that alert is visible
    const alert = await canvas.findByText(/Behandlingen vil gå videre til avslag for manglende dokumentasjon/i);
    await expect(alert).toBeVisible();

    // Diagnosekode field should be disabled
    const diagnosekodeInput = canvas.getByLabelText(/Hvilke diagnoser har barnet/i);
    await expect(diagnosekodeInput).toBeDisabled();

    // Submit - when there are multiple buttons, take the last one (form submit, not Alert)
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify
    await expect(løsAksjonspunkt9301).toHaveBeenCalledWith(undefined, {
      behandlingUuid: '222-3333',
      diagnoser: [],
      begrunnelse: 'Vi mangler dokumentasjon på langvarig sykdom.',
      godkjent: false,
      avslagsårsak: Avslagsårsak.MANGLENDE_DOKUMENTASJON,
    });
  },
};

export const KanRedigeres: Story = {
  decorators: [withMockData],
  play: async ({ canvas }) => {
    // Click first vurdering
    const firstVurderingButton = await canvas.findByRole('button', { name: /15.01.2025/i });
    await userEvent.click(firstVurderingButton);

    // Click "Rediger vurdering" to show the form
    const redigerButton = await canvas.findByRole('button', { name: /Rediger vurdering/i });
    await userEvent.click(redigerButton);

    // Wait for form to appear
    const begrunnelseTextarea = await canvas.findByRole('textbox', {
      name: /Vurder om barnet har en funksjonshemning/i,
    });
    await userEvent.clear(begrunnelseTextarea);
    await userEvent.type(begrunnelseTextarea, 'Sykdommen er ikke langvarig nok til å oppfylle vilkåret.');

    // Select "Nei"
    const radioGroup = canvas.getByRole('group', { name: /Har barnet en funksjonshemming eller langvarig sykdom/i });
    const neiRadio = within(radioGroup).getByLabelText('Nei');
    await userEvent.click(neiRadio);

    // Diagnosekode field should be disabled
    const diagnosekodeInput = canvas.getByLabelText(/Hvilke diagnoser har barnet/i);
    await expect(diagnosekodeInput).toBeDisabled();

    // Submit - when there are multiple buttons, take the last one (form submit, not Alert)
    const submitButton = canvas.getAllByRole('button', { name: /Bekreft og fortsett/i })[1];
    await userEvent.click(submitButton!);

    // Verify
    await expect(løsAksjonspunkt9301).toHaveBeenCalledWith('v1', {
      behandlingUuid: '222-3333',
      diagnoser: [],
      begrunnelse: 'Sykdommen er ikke langvarig nok til å oppfylle vilkåret.',
      godkjent: false,
      avslagsårsak: Avslagsårsak.IKKE_LANGVARIG_SYK,
    });
  },
};

export const KanLøseAksjonspunktUtenEndringer: Story = {
  decorators: [withMockData],
  play: async ({ canvas }) => {
    // Verify alert is visible
    const alert = await canvas.findByText(/Sykdom er ferdig vurdert og du kan gå videre i behandlingen./i);
    await expect(alert).toBeVisible();

    // Click "Bekreft og fortsett"
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify
    await expect(løsAksjonspunkt9301).toHaveBeenCalledWith('v1');
  },
};

export const kanBenytteEnAnnenVurdering: Story = {
  decorators: [withMockData],
  play: async ({ canvas }) => {
    // Velg vurderingen som vises som valgt i vurderingsnavigasjonen
    const valgtVurderingButton = await canvas.findByRole('button', { name: /Valgt/i });
    await userEvent.click(valgtVurderingButton);

    // bytt til vurdering som ikke er valgt
    const ikkeValgtVurderingButton = await canvas.findByRole('button', { name: /10.02.2025/i });
    await userEvent.click(ikkeValgtVurderingButton);

    // klikk på "Bruk denne vurderingen"
    const brukVurderingButton = await canvas.findByRole('button', { name: /Bruk denne sykdomsvurderingen/i });
    await userEvent.click(brukVurderingButton);

    // Verify
    await expect(løsAksjonspunkt9301).toHaveBeenCalledWith('v2');
  },
};

export const Validering: Story = {
  decorators: [withMockDataIkkeVurdert],
  play: async ({ canvas }) => {
    // Wait for form to appear
    const begrunnelseTextarea = await canvas.findByRole('textbox', {
      name: /Vurder om barnet har en funksjonshemning/i,
    });
    await userEvent.clear(begrunnelseTextarea);

    // TEST 1: Mangler radio-valg (Ja/Nei/Mangler dokumentasjon)
    // Don't select any radio option, try to submit
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify that the action was NOT called
    await waitFor(() => expect(løsAksjonspunkt9301).not.toHaveBeenCalled());

    // TEST 2: Mangler begrunnelse
    // Select "Ja" but leave begrunnelse empty
    const radioGroup = canvas.getByRole('group', { name: /Har barnet en funksjonshemming eller langvarig sykdom/i });
    const jaRadio = within(radioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Try to submit without begrunnelse
    await userEvent.click(submitButton);

    // Verify that the action was still NOT called
    await waitFor(() => expect(løsAksjonspunkt9301).not.toHaveBeenCalled());
  },
};
