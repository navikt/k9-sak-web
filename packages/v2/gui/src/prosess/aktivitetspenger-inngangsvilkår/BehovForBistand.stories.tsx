import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { fakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi';
import { BehovForBistand } from './BehovForBistand';

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/BehovForBistand',
  component: BehovForBistand,
  args: {
    api: fakeAktivitetspengerApi,
    behandling: { uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: () => {},
    readOnly: false,
    vurderBistandsvilkårAp: undefined,
    lokalkontorForeslårVilkårAp: undefined,
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
  },
} satisfies Meta<typeof BehovForBistand>;
export default meta;

type Story = StoryObj<typeof meta>;

const lagAksjonspunkt = (
  definisjon: AksjonspunktDto['definisjon'],
  status: AksjonspunktDto['status'] = AksjonspunktStatus.OPPRETTET,
): AksjonspunktDto => ({
  definisjon,
  status,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
});

export const MedÅpentBistandsvilkår: Story = {
  args: {
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR),
    isPermanentlyReadOnly: false,
  },
};

export const MedUtførtBistandsvilkår: Story = {
  args: {
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker har behov for bistand.',
        },
      ],
    },
    isPermanentlyReadOnly: false,
  },
};

export const MedÅpentLokalkontorForeslår: Story = {
  args: {
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
    lokalkontorForeslårVilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR),
    isPermanentlyReadOnly: false,
  },
};

export const IkkeSaksbehandler: Story = {
  args: {
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR),
    isPermanentlyReadOnly: false,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker har behov for bistand.',
        },
      ],
    },
    isPermanentlyReadOnly: false,
  },
};

export const BytterFelterBasertPåVurdering: Story = {
  args: {
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser datofelter når bruker velger oppfylt', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Ja' }));
      await expect(canvas.getByLabelText('Fra')).toBeInTheDocument();
      await expect(canvas.getByLabelText('Til')).toBeInTheDocument();
    });

    await step('viser avslagsårsak når bruker velger ikke oppfylt', async () => {
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
