import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { fakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi';
import { Bosted } from './Bosted';

const lagAksjonspunkt = (
  definisjon: AksjonspunktDto['definisjon'],
  status: AksjonspunktDto['status'] = AksjonspunktStatus.OPPRETTET,
): AksjonspunktDto => ({
  definisjon,
  status,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
});

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/Bosted',
  component: Bosted,
  args: {
    api: fakeAktivitetspengerApi,
    behandling: { uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: () => {},
    lokalkontorForeslårVilkårAp: undefined,
    readOnly: false,
  },
} satisfies Meta<typeof Bosted>;
export default meta;

type Story = StoryObj<typeof meta>;

const periode = { fom: '2024-01-01', tom: '2024-12-31' };

export const IkkeVurdert: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTED, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
};

export const Oppfylt: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker er bosatt i Trondheim kommune.' }],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTED, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
};

export const IkkeOppfylt: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [
        {
          periode,
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          begrunnelse: 'Søker er ikke bosatt i Trondheim kommune.',
          avslagKode: '3001',
        },
      ],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTED, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker er bosatt i Trondheim kommune.' }],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTED, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
};

export const FlerePerioder: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [
        { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Oppfylt.' },
        { periode: { fom: '2024-07-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT },
      ],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTED, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
};

export const ViserFritekstVedAvslag: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTED),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser avslagsårsak ved negativ vurdering', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await expect(canvas.getByText('Avslagsårsak')).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Fritekst' })).toBeInTheDocument();
    });

    await step('viser fritekstfelt når fritekst velges', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Fritekst' }));
      await expect(canvas.getByLabelText('Fritekst avslagsbrev')).toBeInTheDocument();
    });
  },
};
