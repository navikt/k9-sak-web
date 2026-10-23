import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårPeriodeDto.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import OpplaeringProsessIndex, { type OpplaeringProsessIndexProps } from './OpplaeringProsessIndex.js';

const lagPeriode = (
  fom: string,
  tom: string,
  vilkarStatus: VilkårPeriodeDto['vilkarStatus'],
  vurderesIBehandlingen: boolean,
): VilkårPeriodeDto => ({
  vilkarStatus,
  vurderesIBehandlingen,
  periode: { fom, tom },
});

const lagVilkår = (
  vilkarType: VilkårMedPerioderDto['vilkarType'],
  perioder?: VilkårPeriodeDto[],
): VilkårMedPerioderDto => ({
  vilkarType,
  relevanteInnvilgetMerknader: [],
  perioder,
});

const institusjonMedPerioder = [
  lagVilkår(VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON, [
    lagPeriode('2020-03-01', '2020-03-31', vilkårStatus.OPPFYLT, true),
    lagPeriode('2020-01-01', '2020-01-31', vilkårStatus.IKKE_OPPFYLT, false),
  ]),
  lagVilkår(VilkårType.OPPTJENINGSVILKÅRET, [lagPeriode('2020-04-01', '2020-04-30', vilkårStatus.IKKE_OPPFYLT, true)]),
] satisfies VilkårMedPerioderDto[];

const openMatchingAksjonspunkt: AksjonspunktDto = {
  definisjon: AksjonspunktDefinisjon.VURDER_INSTITUSJON,
  status: aksjonspunktStatus.OPPRETTET,
};

const closedMatchingAksjonspunkt: AksjonspunktDto = {
  definisjon: AksjonspunktDefinisjon.VURDER_INSTITUSJON,
  status: aksjonspunktStatus.UTFØRT,
};

const openUnrelatedAksjonspunkt: AksjonspunktDto = {
  definisjon: AksjonspunktDefinisjon.VURDER_OPPLÆRING,
  status: aksjonspunktStatus.OPPRETTET,
};

const noVisibleScenarios: { id: string; props: OpplaeringProsessIndexProps }[] = [
  {
    id: 'no-conditions',
    props: { aksjonspunkter: [], vilkar: [], vilkarPanel: 'INSTITUSJON', visAllePerioder: false },
  },
  {
    id: 'unrelated-condition',
    props: {
      aksjonspunkter: [],
      vilkar: [
        lagVilkår(VilkårType.OPPTJENINGSVILKÅRET, [lagPeriode('2020-03-01', '2020-03-31', vilkårStatus.OPPFYLT, true)]),
      ],
      vilkarPanel: 'INSTITUSJON',
      visAllePerioder: false,
    },
  },
  {
    id: 'missing-periods',
    props: {
      aksjonspunkter: [],
      vilkar: [lagVilkår(VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON)],
      vilkarPanel: 'INSTITUSJON',
      visAllePerioder: false,
    },
  },
  {
    id: 'empty-periods',
    props: {
      aksjonspunkter: [],
      vilkar: [lagVilkår(VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON, [])],
      vilkarPanel: 'INSTITUSJON',
      visAllePerioder: false,
    },
  },
];

const meta = {
  title: 'gui/prosess/opplaering/OpplaeringProsessIndex',
  component: OpplaeringProsessIndex,
  tags: ['opplaering-prosess'],
  args: { aksjonspunkter: [] },
} satisfies Meta<typeof OpplaeringProsessIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OppfyltGjeldendePeriode: Story = {
  args: {
    vilkar: institusjonMedPerioder,
    vilkarPanel: 'INSTITUSJON',
    visAllePerioder: false,
  },
  play: async ({ canvas, step }) => {
    await step('Viser riktig panel og gjeldende periode', async () => {
      await expect(canvas.getByRole('heading', { name: 'Institusjon' })).toBeInTheDocument();
      await expect(canvas.getByText('Vilkåret er oppfylt')).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: '01.03.2020 - 31.03.2020' })).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: '01.01.2020 - 31.01.2020' })).not.toBeInTheDocument();
      await expect(canvas.queryByRole('heading', { name: 'Opptjening' })).not.toBeInTheDocument();
    });
  },
};

export const Avslatt: Story = {
  args: {
    vilkar: [
      lagVilkår(VilkårType.LANGVARIG_SYKDOM, [lagPeriode('2020-03-01', '2020-03-31', vilkårStatus.IKKE_OPPFYLT, true)]),
    ],
    vilkarPanel: 'LANGVARIG_SYKDOM',
    visAllePerioder: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Langvarig sykdom' })).toBeInTheDocument();
    await expect(canvas.getByText('Vilkåret er avslått')).toBeInTheDocument();
  },
};

export const OppfyltUtenSkrivehandlinger: Story = {
  args: {
    vilkar: [
      lagVilkår(VilkårType.NØDVENDIG_OPPLÆRING, [lagPeriode('2020-03-01', '2020-03-31', vilkårStatus.OPPFYLT, true)]),
    ],
    vilkarPanel: 'NØDVENDIG_OPPLÆRING',
    visAllePerioder: false,
  },
  play: async ({ canvas, step }) => {
    await step('Viser resultat uten redigerings- eller sendehandlinger', async () => {
      await expect(canvas.getByRole('heading', { name: 'Nødvendig opplæring' })).toBeInTheDocument();
      await expect(canvas.getByText('Vilkåret er oppfylt')).toBeInTheDocument();
      await expect(canvas.queryAllByRole('textbox')).toHaveLength(0);
      await expect(canvas.queryAllByRole('radio')).toHaveLength(0);
      await expect(canvas.queryAllByRole('combobox')).toHaveLength(0);
      await expect(canvas.getAllByRole('button')).toHaveLength(1);
    });
  },
};

export const IkkeVurdertAksjonspunktvarsling: Story = {
  args: {
    vilkar: [
      lagVilkår(VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON, [
        lagPeriode('2020-03-01', '2020-03-31', vilkårStatus.IKKE_VURDERT, true),
      ]),
    ],
    vilkarPanel: 'INSTITUSJON',
    visAllePerioder: false,
  },
  render: args => (
    <>
      <OpplaeringProsessIndex {...args} aksjonspunkter={[openMatchingAksjonspunkt]} />
      <OpplaeringProsessIndex {...args} aksjonspunkter={[closedMatchingAksjonspunkt, openUnrelatedAksjonspunkt]} />
    </>
  ),
  play: async ({ canvas, step }) => {
    await step('Viser varsel for åpent relevant aksjonspunkt, men ikke for lukket eller uvedkommende', async () => {
      await expect(canvas.getAllByText('Ikke behandlet')).toHaveLength(2);
      const periodeknapper = canvas.getAllByRole('button', { name: '01.03.2020 - 31.03.2020' });
      await expect(periodeknapper).toHaveLength(2);
      await expect(periodeknapper[0]?.querySelector('svg')).toBeInTheDocument();
      await expect(periodeknapper[1]?.querySelector('svg')).not.toBeInTheDocument();
    });
  },
};

export const ValgbareTidligerePerioder: Story = {
  args: {
    vilkar: [
      lagVilkår(VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON, [
        lagPeriode('2020-01-01', '2020-01-31', vilkårStatus.IKKE_OPPFYLT, false),
        lagPeriode('2020-02-01', '2020-02-29', vilkårStatus.OPPFYLT, false),
      ]),
    ],
    vilkarPanel: 'INSTITUSJON',
    visAllePerioder: true,
  },
  play: async ({ canvas, userEvent, step }) => {
    await step('Velger mellom tidligere perioder', async () => {
      const tidligerePeriode = canvas.getByRole('button', { name: '01.01.2020 - 31.01.2020' });
      await expect(canvas.getByRole('button', { name: '01.02.2020 - 29.02.2020' })).toBeInTheDocument();
      await userEvent.click(tidligerePeriode);
      await expect(canvas.getByText('Vilkåret er avslått')).toBeInTheDocument();
    });
  },
};

export const IngenSynligeVilkår: Story = {
  args: {
    vilkar: [],
    vilkarPanel: 'INSTITUSJON',
    visAllePerioder: false,
  },
  render: () => (
    <>
      {noVisibleScenarios.map(({ id, props }) => (
        <OpplaeringProsessIndex key={id} {...props} />
      ))}
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
  },
};
