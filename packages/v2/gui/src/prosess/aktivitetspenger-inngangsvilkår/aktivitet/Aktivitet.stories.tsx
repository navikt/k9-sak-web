import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FakeAktivitetspengerApi } from '../../../storybook/mocks/FakeAktivitetspengerApi';
import { Aktivitet } from './Aktivitet';

class FakeApiMedAvkortingsperiode extends FakeAktivitetspengerApi {
  override async hentPerioderSomKanAvkortes() {
    return {
      resultat: [{ vilkårType: vilkarType.AKTIVITETSVILKÅR, perioder: [{ fom: '2024-01-01', tom: '2024-12-31' }] }],
    };
  }
}

const fakeApiMedAvkortingsperiode = new FakeApiMedAvkortingsperiode();

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/Aktivitet',
  component: Aktivitet,
  args: {
    api: fakeApiMedAvkortingsperiode,
    behandling: { uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: async () => {},
    readOnly: false,
    vurderAktivitetsvilkårAp: undefined,
    lokalkontorForeslårVilkårAp: undefined,
    vurderAktivitetsvilkårVilkår: {
      vilkarType: vilkarType.AKTIVITETSVILKÅR,
      perioder: [{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
  },
} satisfies Meta<typeof Aktivitet>;
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

export const MedÅpentAktivitetsvilkår: Story = {
  args: {
    vurderAktivitetsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR),
    isPermanentlyReadOnly: false,
  },
};

export const MedUtførtAktivitetsvilkår: Story = {
  args: {
    vurderAktivitetsvilkårAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR,
      AksjonspunktStatus.UTFØRT,
    ),
    vurderAktivitetsvilkårVilkår: {
      vilkarType: vilkarType.AKTIVITETSVILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker er i aktivitet.',
        },
      ],
    },
    isPermanentlyReadOnly: false,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    vurderAktivitetsvilkårAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR,
      AksjonspunktStatus.UTFØRT,
    ),
    vurderAktivitetsvilkårVilkår: {
      vilkarType: vilkarType.AKTIVITETSVILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker er i aktivitet.',
        },
      ],
    },
    isPermanentlyReadOnly: false,
  },
};

export const BytterFelterBasertPåVurdering: Story = {
  args: {
    vurderAktivitetsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser datofelter når bruker velger Ja', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Ja' }));
      await expect(canvas.getByLabelText('Fra og med')).toBeInTheDocument();
      await expect(canvas.getByLabelText('Til og med')).toBeInTheDocument();
    });

    await step('viser fritekstfelt direkte når bruker velger Nei', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await expect(canvas.getByLabelText('Fritekst avslagsbrev')).toBeInTheDocument();
    });
  },
};
