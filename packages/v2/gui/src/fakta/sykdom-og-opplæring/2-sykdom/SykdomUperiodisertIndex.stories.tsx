import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, fn, userEvent, within } from 'storybook/test';
import withK9Kodeverkoppslag from '../../../storybook/decorators/withK9Kodeverkoppslag.jsx';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex.jsx';
import SykdomUperiodisertIndex from './SykdomUperiodisertIndex';
import SykdomOgOpplæringBackendClient from '../SykdomOgOpplæringBackendClient';
import { k9_kodeverk_vilkår_Avslagsårsak as Avslagsårsak } from '@k9-sak-web/backend/k9sak/generated/types.js';

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
    aksjonspunkter: [],
  };
  return (
    <SykdomOgOpplæringContext value={sykdomOgOpplæringContextState}>
      <Story />
    </SykdomOgOpplæringContext>
  );
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
    },
    {
      uuid: 'v2',
      vurdertTidspunkt: '2025-02-10T12:30:00Z',
      godkjent: false,
      avslagsårsak: Avslagsårsak.MANGLENDE_DOKUMENTASJON,
      vurderingFraAnnenpart: true,
      begrunnelse: 'Barnet har langvarig sykdom som krever opplæring',
    },
  ];

  // Mock which vurdering is used by the aksjonspunkt
  const vurdertLangvarigSykdomMock = {
    vurderingUuid: 'v1',
    resultat: 'OPPFYLT',
  } as const;

  // Prototype-based mocks (avoid MSW and keep story-local)
  SykdomOgOpplæringBackendClient.prototype.hentLangvarigSykVurderingerFagsak = async () =>
    langvarigSykVurderingerMock as any;
  SykdomOgOpplæringBackendClient.prototype.hentVurdertLangvarigSykdom = async () => vurdertLangvarigSykdomMock as any;

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
  decorators: [withMockData],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for navigation to load and click first vurdering
    const firstVurderingButton = await canvas.findByRole('button', { name: /15.01.2025/i });
    await expect(firstVurderingButton).toBeInTheDocument();
    await userEvent.click(firstVurderingButton);

    // Wait for form to appear
    const begrunnelseTextarea = await canvas.findByLabelText(/Vurder om barnet har en funksjonshemning/i);
    await expect(begrunnelseTextarea).toBeInTheDocument();

    // Fill in begrunnelse
    await userEvent.clear(begrunnelseTextarea);
    await userEvent.type(begrunnelseTextarea, 'Barnet har langvarig sykdom som krever opplæring');

    // Select "Ja" for godkjent
    const radioGroup = canvas.getByRole('group', { name: /Har barnet en funksjonshemming eller langvarig sykdom/i });
    const jaRadio = within(radioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify that the action was called
    await expect(løsAksjonspunkt9301).toHaveBeenCalledWith('v1', {
      behandlingUuid: '222-3333',
      diagnoser: [],
      begrunnelse: 'Barnet har langvarig sykdom som krever opplæring',
      godkjent: true,
      avslagsårsak: undefined,
    });
  },
};

export const GodkjentMedDiagnoser: Story = {
  decorators: [withMockData],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click first vurdering
    const firstVurderingButton = await canvas.findByRole('button', { name: /15.01.2025/i });
    await userEvent.click(firstVurderingButton);

    // Fill begrunnelse
    const begrunnelseTextarea = await canvas.findByLabelText(/Vurder om barnet har en funksjonshemning/i);
    await userEvent.clear(begrunnelseTextarea);
    await userEvent.type(begrunnelseTextarea, 'Barnet har langvarig sykdom som krever spesiell opplæring av foreldre.');

    // Select "Ja"
    const radioGroup = canvas.getByRole('group', { name: /Har barnet en funksjonshemming eller langvarig sykdom/i });
    const jaRadio = within(radioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Diagnosekode field should be enabled
    const diagnosekodeInput = canvas.getByLabelText(/Hvilke diagnoser har barnet/i);
    await expect(diagnosekodeInput).toBeEnabled();

    // Submit
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify
    await expect(løsAksjonspunkt9301).toHaveBeenCalledWith('v1', {
      behandlingUuid: '222-3333',
      diagnoser: [],
      begrunnelse: 'Barnet har langvarig sykdom som krever spesiell opplæring av foreldre.',
      godkjent: true,
      avslagsårsak: undefined,
    });
  },
};

export const IkkeGodkjent: Story = {
  decorators: [withMockData],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click first vurdering
    const firstVurderingButton = await canvas.findByRole('button', { name: /15.01.2025/i });
    await userEvent.click(firstVurderingButton);

    // Fill begrunnelse
    const begrunnelseTextarea = await canvas.findByLabelText(/Vurder om barnet har en funksjonshemning/i);
    await userEvent.clear(begrunnelseTextarea);
    await userEvent.type(begrunnelseTextarea, 'Sykdommen er ikke langvarig nok til å oppfylle vilkåret.');

    // Select "Nei"
    const radioGroup = canvas.getByRole('group', { name: /Har barnet en funksjonshemming eller langvarig sykdom/i });
    const neiRadio = within(radioGroup).getByLabelText('Nei');
    await userEvent.click(neiRadio);

    // Diagnosekode field should be disabled
    const diagnosekodeInput = canvas.getByLabelText(/Hvilke diagnoser har barnet/i);
    await expect(diagnosekodeInput).toBeDisabled();

    // Submit
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

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

export const ManglerDokumentasjon: Story = {
  decorators: [withMockData],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click first vurdering
    const firstVurderingButton = await canvas.findByRole('button', { name: /15.01.2025/i });
    await userEvent.click(firstVurderingButton);

    // Fill begrunnelse
    const begrunnelseTextarea = await canvas.findByLabelText(/Vurder om barnet har en funksjonshemning/i);
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

    // Submit
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify
    await expect(løsAksjonspunkt9301).toHaveBeenCalledWith('v1', {
      behandlingUuid: '222-3333',
      diagnoser: [],
      begrunnelse: 'Vi mangler dokumentasjon på langvarig sykdom.',
      godkjent: false,
      avslagsårsak: Avslagsårsak.MANGLENDE_DOKUMENTASJON,
    });
  },
};
