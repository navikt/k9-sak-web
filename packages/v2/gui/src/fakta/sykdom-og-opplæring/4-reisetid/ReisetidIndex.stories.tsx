import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, fn, userEvent, within, waitFor } from 'storybook/test';
import withK9Kodeverkoppslag from '../../../storybook/decorators/withK9Kodeverkoppslag';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import ReisetidIndex from './ReisetidIndex';
import SykdomOgOpplæringBackendClient from '../SykdomOgOpplæringBackendClient';
import {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidResultat,
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

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
    behandlingUuid: '444-5555',
    aksjonspunkter: [
      {
        definisjon: '9302', // VURDER_OPPLÆRING must be completed for form to be editable
        status: 'UTFO', // UTFØRT = completed
        kanLoses: false,
        erAktivt: false,
        toTrinnsBehandling: false,
      },
      {
        definisjon: '9303', // VURDER_REISETID is open
        status: 'OPPR',
        kanLoses: true,
        erAktivt: true,
        toTrinnsBehandling: false,
      },
    ] as unknown as Aksjonspunkt[],
  };
  return (
    <SykdomOgOpplæringContext.Provider value={sykdomOgOpplæringContextState}>
      <Story />
    </SykdomOgOpplæringContext.Provider>
  );
};

const withMockData: Decorator = Story => {
  const vurdertReisetidMock = {
    vurderinger: [
      {
        uuid: 'r1',
        reisetid: {
          periode: { fom: '2025-04-01', tom: '2025-04-05' },
          resultat: ReisetidResultat.MÅ_VURDERES,
          begrunnelse: '',
          erTilVurdering: true,
        },
        informasjonFraSøker: {
          beskrivelseFraSøker: 'Lang reisevei',
          reisetidPeriodeOppgittISøknad: { fom: '2025-04-01', tom: '2025-04-05' },
        },
      },
      {
        uuid: 'r2',
        reisetid: {
          periode: { fom: '2025-04-10', tom: '2025-04-12' },
          resultat: ReisetidResultat.GODKJENT,
          begrunnelse: 'lolololol',
          erTilVurdering: true,
        },
        informasjonFraSøker: {
          beskrivelseFraSøker: 'Kort reisevei',
          reisetidPeriodeOppgittISøknad: { fom: '2025-04-10', tom: '2025-04-12' },
        },
      },
    ],
  };

  type VurdertReisetidReturn = Awaited<ReturnType<SykdomOgOpplæringBackendClient['getVurdertReisetid']>>;

  SykdomOgOpplæringBackendClient.prototype.getVurdertReisetid = async (): Promise<VurdertReisetidReturn> =>
    vurdertReisetidMock as unknown as VurdertReisetidReturn;

  return <Story />;
};

const withMockDataMåVurderes: Decorator = Story => {
  const vurdertReisetidMock = {
    vurderinger: [
      {
        uuid: 'r1',
        reisetid: {
          periode: { fom: '2025-04-01', tom: '2025-04-05' },
          resultat: 'MÅ_VURDERES', // Use string literal to ensure it matches the runtime check
          begrunnelse: '',
          erTilVurdering: true,
        },
        informasjonFraSøker: {
          beskrivelseFraSøker: 'Trenger å reise dagen før på grunn av lang reisevei',
          reisetidPeriodeOppgittISøknad: { fom: '2025-04-01', tom: '2025-04-05' },
        },
      },
    ],
  };

  type VurdertReisetidReturn = Awaited<ReturnType<SykdomOgOpplæringBackendClient['getVurdertReisetid']>>;

  SykdomOgOpplæringBackendClient.prototype.getVurdertReisetid = async (): Promise<VurdertReisetidReturn> =>
    vurdertReisetidMock as unknown as VurdertReisetidReturn;

  return <Story />;
};

const meta = {
  title: 'gui/fakta/sykdom-og-opplæring/4-reisetid',
  component: ReisetidIndex,
  decorators: [withK9Kodeverkoppslag(), withSykdomOgOpplæringContext()],
} satisfies Meta<typeof ReisetidIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withMockData],
};

export const MedRedigerbarForm: Story = {
  decorators: [withMockDataMåVurderes],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for navigation to load and click the period
    const periodButton = await canvas.findByRole('button', { name: /01.04.2025/i });
    await expect(periodButton).toBeInTheDocument();
    await userEvent.click(periodButton);

    // Wait for form to appear
    const vurderingTextarea = await canvas.findByLabelText(/Vurder om det er nødvendig å reise/i);
    await expect(vurderingTextarea).toBeInTheDocument();

    // Fill in vurdering
    await userEvent.type(vurderingTextarea, 'Lang reisevei gjør at reisedager er nødvendige');

    // Select "Ja" for godkjent
    const radioGroup = await canvas.findByRole('group', { name: /Innvilges reisedager/i });
    const jaRadio = within(radioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Submit the form
    const submitButton = await canvas.findByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify that the action was called
    await expect(løsAksjonspunkt9303).toHaveBeenCalledWith({
      begrunnelse: 'Lang reisevei gjør at reisedager er nødvendige',
      godkjent: true,
      periode: {
        fom: '2025-04-01',
        tom: '2025-04-05',
      },
    });
  },
};

export const AvslåttReisetid: Story = {
  decorators: [withMockDataMåVurderes],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for navigation and click period
    const periodButton = await canvas.findByRole('button', { name: /01.04.2025/i });
    await userEvent.click(periodButton);

    // Wait for form
    const vurderingTextarea = await canvas.findByLabelText(/Vurder om det er nødvendig å reise/i);
    await expect(vurderingTextarea).toBeInTheDocument();

    // Fill vurdering
    await userEvent.type(vurderingTextarea, 'Reiseveien er kort nok til å ikke kreve reisedager');

    // Select "Nei"
    const radioGroup = await canvas.findByRole('group', { name: /Innvilges reisedager/i });
    const neiRadio = within(radioGroup).getByLabelText('Nei');
    await userEvent.click(neiRadio);

    // Submit
    const submitButton = await canvas.findByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify
    await expect(løsAksjonspunkt9303).toHaveBeenCalledWith({
      begrunnelse: 'Reiseveien er kort nok til å ikke kreve reisedager',
      godkjent: false,
      periode: {
        fom: '2025-04-01',
        tom: '2025-04-05',
      },
    });
  },
};

export const ValideringManglerBegrunnelse: Story = {
  decorators: [withMockDataMåVurderes],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for navigation and click period
    const periodButton = await canvas.findByRole('button', { name: /01.04.2025/i });
    await userEvent.click(periodButton);

    // Wait for form
    const vurderingTextarea = await canvas.findByLabelText(/Vurder om det er nødvendig å reise/i);
    await expect(vurderingTextarea).toBeInTheDocument();

    // Don't fill vurdering - test validation

    // Select "Ja" without begrunnelse
    const radioGroup = await canvas.findByRole('group', { name: /Innvilges reisedager/i });
    const jaRadio = within(radioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Try to submit
    const submitButton = await canvas.findByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify that the action was NOT called
    await waitFor(() => expect(løsAksjonspunkt9303).not.toHaveBeenCalled());
  },
};

export const ValideringManglerVurdering: Story = {
  decorators: [withMockDataMåVurderes],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for navigation and click period
    const periodButton = await canvas.findByRole('button', { name: /01.04.2025/i });
    await userEvent.click(periodButton);

    // Wait for form
    const vurderingTextarea = await canvas.findByLabelText(/Vurder om det er nødvendig å reise/i);
    await expect(vurderingTextarea).toBeInTheDocument();

    // Fill vurdering
    await userEvent.type(vurderingTextarea, 'Dette er en begrunnelse');

    // Don't select any radio option

    // Try to submit
    const submitButton = await canvas.findByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify that the action was NOT called
    await waitFor(() => expect(løsAksjonspunkt9303).not.toHaveBeenCalled());
  },
};
