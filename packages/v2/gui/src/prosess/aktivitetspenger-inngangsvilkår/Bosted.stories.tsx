import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi';
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

class FakeAktivitetspengerApiMedAvkortingsperiode extends FakeAktivitetspengerApi {
  override async hentPerioderSomKanAvkortes() {
    return {
      resultat: [
        {
          vilkårType: vilkarType.BOSTEDSVILKÅR,
          perioder: [{ fom: '2024-01-01', tom: '2024-12-31' }],
        },
      ],
    };
  }
}

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/Bosted',
  component: Bosted,
  args: {
    api: new FakeAktivitetspengerApiMedAvkortingsperiode(),
    behandling: { uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: async () => {},
    lokalkontorForeslårVilkårAp: undefined,
    readOnly: false,
    bostedGrunnlag: { perioder: [] },
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
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
};

export const Oppfylt: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker er bosatt i Trondheim kommune.' }],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
};

export const LesevisningViserTekst: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker er bosatt i Trondheim kommune.' }],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser vurderingen som tekst, ikke som skjemafelter', async () => {
      await expect(await canvas.findByText('Søker er bosatt i Trondheim kommune.')).toBeInTheDocument();
      await expect(canvas.getByText('Bosatt i Trondheim kommune:')).toBeInTheDocument();
      await expect(canvas.getByText('01.01.2024 – 31.12.2024')).toBeInTheDocument();
      await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
      await expect(canvas.queryByRole('radio')).not.toBeInTheDocument();
    });
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
          avslagKode: BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM,
        },
      ],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
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
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
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
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
};

export const BeholderVerdierVedPeriodebytte: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [
        { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.IKKE_VURDERT },
        { periode: { fom: '2024-07-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT },
      ],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const begrunnelse = canvas.getByRole('textbox', { name: /Vurder om søker er bosatt/ });

    await step('skriver begrunnelse i første periode', async () => {
      await userEvent.type(begrunnelse, 'Begrunnelse for første periode');
    });

    await step('bytter periode og viser egne verdier', async () => {
      await userEvent.click(canvas.getByText('01.07.2024'));
      await expect(canvas.getByRole('textbox', { name: /Vurder om søker er bosatt/ })).toHaveValue('');
    });

    await step('beholder verdiene ved retur til første periode', async () => {
      await userEvent.click(canvas.getByText('01.01.2024'));
      await expect(canvas.getByRole('textbox', { name: /Vurder om søker er bosatt/ })).toHaveValue(
        'Begrunnelse for første periode',
      );
    });
  },
};

export const MedKunVilkårUtenAksjonspunkt: Story = {
  args: {
    bostedAp: undefined,
    lokalkontorForeslårVilkårAp: undefined,
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker er bosatt i Trondheim kommune.' }],
    },
    isPermanentlyReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser ikke advarsel når aksjonspunkt mangler', async () => {
      await expect(
        canvas.queryByText('Vurder om søker er bosatt i Trondheim kommune på søknadstidspunktet.', { exact: false }),
      ).not.toBeInTheDocument();
    });

    await step('viser ikke bekreft-knapp når panelet er permanent låst', async () => {
      await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    });
  },
};

export const ViserFritekstVedAvslag: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser avslagsårsak ved negativ vurdering', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await expect(canvas.getByText('Avslagsårsak')).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Annen årsak' })).toBeInTheDocument();
    });

    await step('viser fritekstfelt når annen årsak velges', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Annen årsak' }));
      await expect(canvas.getByLabelText('Fritekst avslagsbrev')).toBeInTheDocument();
    });
  },
};
