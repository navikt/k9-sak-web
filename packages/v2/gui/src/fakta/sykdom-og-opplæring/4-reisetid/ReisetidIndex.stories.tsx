import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, fn, userEvent, within } from 'storybook/test';
import { oppslagKodeverkSomObjektK9Sak } from '../../../kodeverk/mocks/oppslagKodeverkSomObjektK9Sak.js';
import { K9SakKodeverkoppslag } from '../../../kodeverk/oppslag/K9SakKodeverkoppslag.js';
import withK9Kodeverkoppslag from '../../../storybook/decorators/withK9Kodeverkoppslag.jsx';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex.jsx';
import ReisetidIndex from './ReisetidIndex';
import SykdomOgOpplæringBackendClient from '../SykdomOgOpplæringBackendClient';
import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidResultat } from '@k9-sak-web/backend/k9sak/generated/types.js';

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
    aksjonspunkter: [],
  };
  return (
    <SykdomOgOpplæringContext value={sykdomOgOpplæringContextState}>
      <Story />
    </SykdomOgOpplæringContext>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sakKodeverkOppslag = new K9SakKodeverkoppslag(oppslagKodeverkSomObjektK9Sak);

const withMockData: Decorator = Story => {
  const vurdertReisetidMock = {
    vurderinger: [
      {
        uuid: 'r1',
        reisetid: {
          periode: { fom: '2025-04-01', tom: '2025-04-05' },
          resultat: 'GODKJENT' as ReisetidResultat,
          begrunnelse: 'Godkjent reise',
          erTilVurdering: false,
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
          resultat: 'IKKE_GODKJENT' as ReisetidResultat,
          begrunnelse: 'Ikke nødvendig',
          erTilVurdering: false,
        },
        informasjonFraSøker: {
          beskrivelseFraSøker: 'Kort reisevei',
          reisetidPeriodeOppgittISøknad: { fom: '2025-04-10', tom: '2025-04-12' },
        },
      },
    ],
  } as const;

  SykdomOgOpplæringBackendClient.prototype.getVurdertReisetid = async () => vurdertReisetidMock as any;

  return <Story />;
};

const withMockDataMåVurderes: Decorator = Story => {
  const vurdertReisetidMock = {
    vurderinger: [
      {
        uuid: 'r1',
        reisetid: {
          periode: { fom: '2025-04-01', tom: '2025-04-05' },
          resultat: 'MÅ_VURDERES' as ReisetidResultat,
          begrunnelse: '',
          erTilVurdering: true,
        },
        informasjonFraSøker: {
          beskrivelseFraSøker: 'Trenger å reise dagen før på grunn av lang reisevei',
          reisetidPeriodeOppgittISøknad: { fom: '2025-04-01', tom: '2025-04-05' },
        },
      },
    ],
  } as const;

  SykdomOgOpplæringBackendClient.prototype.getVurdertReisetid = async () => vurdertReisetidMock as any;

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for navigation to load and click first reisetid period
    const firstPeriodButton = await canvas.findByRole('button', { name: /01.04.2025/i });
    await expect(firstPeriodButton).toBeInTheDocument();
    await userEvent.click(firstPeriodButton);

    // The first period has resultat GODKJENT, so it should show readonly view
    // Click the second period which has resultat IKKE_GODKJENT (also readonly)
    const secondPeriodButton = canvas.getByRole('button', { name: /10.04.2025/i });
    await userEvent.click(secondPeriodButton);

    // Verify content is visible for the readonly view
    const vurderingTitle = await canvas.findByText(/Vurdering av reisetid/i);
    await expect(vurderingTitle).toBeInTheDocument();
  },
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
    await userEvent.clear(vurderingTextarea);
    await userEvent.type(vurderingTextarea, 'Lang reisevei gjør at reisedager er nødvendige');

    // Select "Ja" for godkjent
    const radioGroup = canvas.getByRole('group', { name: /Innvilges reisedager/i });
    const jaRadio = within(radioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
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
