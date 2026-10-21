import { aksjonspunktStatus, type AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { withFakeUttakBackend } from '@k9-sak-web/gui/storybook/decorators/withFakeUttakBackend.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import {
  lagOppfyltPeriode,
  lagOverstyringUttakAksjonspunkt,
  lagUtredBehandling,
  lagUttak,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakStoryMocks.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { UnntakProsessIndex } from '../../prosess/unntak/UnntakProsessIndex.js';
import Uttak from '../../prosess/uttak/Uttak.js';
import { VilkarresultatMedOverstyringProsessIndex } from '../../prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';

/**
 * Oversikt over alle steder der saksbehandlere uten overstyrerrolle får varsel om overstyring.
 * Bruk kontrollene for å bytte mellom overstyrer/ikke overstyrer og åpent/utført aksjonspunkt.
 * Se skillen .github/skills/overstyring/SKILL.md for hvilke steder som er med og hvorfor.
 */
interface OversiktArgs {
  erOverstyrer: boolean;
  status: AksjonspunktStatus;
}

const meta = {
  title: 'gui/shared/overstyring/Oversikt over overstyringer',
  args: {
    erOverstyrer: false,
    status: aksjonspunktStatus.OPPRETTET,
  },
  argTypes: {
    erOverstyrer: { control: 'boolean', name: 'Saksbehandler er overstyrer' },
    status: {
      control: 'inline-radio',
      options: [aksjonspunktStatus.OPPRETTET, aksjonspunktStatus.UTFØRT],
      labels: { [aksjonspunktStatus.OPPRETTET]: 'Åpent', [aksjonspunktStatus.UTFØRT]: 'Utført' },
      name: 'Status på aksjonspunktet',
    },
  },
  decorators: [
    withK9Kodeverkoppslag(),
    Story => (
      <BehandlingProvider refetchBehandling={fn()}>
        <Story />
      </BehandlingProvider>
    ),
  ],
} satisfies Meta<OversiktArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

const forventVarsel = async ({
  canvas,
  args,
}: {
  canvas: { findByText: (tekst: RegExp) => Promise<HTMLElement> };
  args: OversiktArgs;
}) => {
  const tittel =
    args.status === aksjonspunktStatus.UTFØRT ? /^Overstyring av .* er utført\.$/ : /^Overstyring av .* må vurderes\.$/;
  await expect(await canvas.findByText(tittel)).toBeInTheDocument();
};

const utført = { status: aksjonspunktStatus.UTFØRT };

const lagVilkår = (vilkarType: VilkårType) => [
  {
    vilkarType,
    overstyrbar: true,
    relevanteInnvilgetMerknader: [],
    perioder: [
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        vurderesIBehandlingen: true,
        periode: { fom: '2024-01-01', tom: '2024-12-31' },
      },
    ],
  },
];

const VilkårMedOverstyring = ({
  args,
  vilkarType,
  overstyringApKode,
  panelTittel,
  erMedlemskapsPanel = false,
}: {
  args: OversiktArgs;
  vilkarType: VilkårType;
  overstyringApKode: AksjonspunktDefinisjon;
  panelTittel: string;
  erMedlemskapsPanel?: boolean;
}) => (
  <VilkarresultatMedOverstyringProsessIndex
    behandling={{ type: behandlingType.FØRSTEGANGSSØKNAD }}
    aksjonspunkter={[
      { definisjon: overstyringApKode, aksjonspunktType: aksjonspunktType.OVERSTYRING, status: args.status },
    ]}
    submitCallback={fn()}
    overrideReadOnly={false}
    kanOverstyreAccess={{ isEnabled: args.erOverstyrer }}
    toggleOverstyring={fn()}
    erOverstyrt={false}
    panelTittelKode={panelTittel}
    overstyringApKode={overstyringApKode}
    erMedlemskapsPanel={erMedlemskapsPanel}
    visPeriodisering={false}
    vilkar={lagVilkår(vilkarType)}
    visAllePerioder={false}
  />
);

export const OmsorgenForÅpent: Story = {
  name: 'Omsorgen for – åpent',
  render: args => (
    <VilkårMedOverstyring
      args={args}
      vilkarType={VilkårType.OMSORGEN_FOR}
      overstyringApKode={AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR}
      panelTittel="Omsorgen for"
    />
  ),
  play: forventVarsel,
};

export const MedlemskapÅpent: Story = {
  name: 'Medlemskap – åpent',
  render: args => (
    <VilkårMedOverstyring
      args={args}
      vilkarType={VilkårType.MEDLEMSKAPSVILKÅRET}
      overstyringApKode={AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET}
      panelTittel="Medlemskap"
      erMedlemskapsPanel
    />
  ),
  play: forventVarsel,
};

export const FortsattMedlemskapÅpent: Story = {
  name: 'Fortsatt medlemskap – åpent',
  render: args => (
    <VilkårMedOverstyring
      args={args}
      vilkarType={VilkårType.MEDLEMSKAPSVILKÅRET}
      overstyringApKode={AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET}
      panelTittel="Fortsatt medlem"
      erMedlemskapsPanel
    />
  ),
  play: forventVarsel,
};

export const OpptjeningÅpent: Story = {
  name: 'Opptjening – åpent',
  render: args => (
    <VilkårMedOverstyring
      args={args}
      vilkarType={VilkårType.OPPTJENINGSVILKÅRET}
      overstyringApKode={AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET}
      panelTittel="Opptjening"
    />
  ),
  play: forventVarsel,
};

export const UttakÅpent: Story = {
  name: 'Uttak – åpent',
  decorators: [
    withFakeUttakBackend({
      uttak: lagUttak([lagOppfyltPeriode('2024-01-01/2024-01-15', { manueltOverstyrt: true, uttaksgrad: 80 })]),
      overstyringer: [
        {
          id: 1,
          periode: { fom: '2024-01-01', tom: '2024-01-15' },
          søkersUttaksgrad: 80,
          begrunnelse: 'Overstyrt uttaksgrad',
          utbetalingsgrader: [{ arbeidsforhold: { type: 'AT', orgnr: '123456789' }, utbetalingsgrad: 80 }],
        },
      ],
    }),
  ],
  render: args => (
    <Uttak
      behandling={lagUtredBehandling()}
      erOverstyrer={args.erOverstyrer}
      aksjonspunkter={[lagOverstyringUttakAksjonspunkt(args.status)]}
      readOnly={false}
    />
  ),
  play: forventVarsel,
};

export const UnntakÅpent: Story = {
  name: 'Unntak – åpent',
  render: args => (
    <UnntakProsessIndex
      periode={{ fom: '2024-01-01', tom: '2024-12-31' }}
      isReadOnly={false}
      readOnlySubmitButton={false}
      submitCallback={fn()}
      aksjonspunkter={[{ aksjonspunktType: aksjonspunktType.OVERSTYRING, status: args.status }]}
      erOverstyrer={args.erOverstyrer}
    />
  ),
  play: forventVarsel,
};

export const OmsorgenForUtført: Story = {
  ...OmsorgenForÅpent,
  name: 'Omsorgen for – utført',
  args: utført,
};

export const MedlemskapUtført: Story = {
  ...MedlemskapÅpent,
  name: 'Medlemskap – utført',
  args: utført,
};

export const FortsattMedlemskapUtført: Story = {
  ...FortsattMedlemskapÅpent,
  name: 'Fortsatt medlemskap – utført',
  args: utført,
};

export const OpptjeningUtført: Story = {
  ...OpptjeningÅpent,
  name: 'Opptjening – utført',
  args: utført,
};

export const UttakUtført: Story = {
  ...UttakÅpent,
  name: 'Uttak – utført',
  args: utført,
};

export const UnntakUtført: Story = {
  ...UnntakÅpent,
  name: 'Unntak – utført',
  args: utført,
};
