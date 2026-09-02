import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { BistandsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BistandsvilkårIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { FakeAktivitetspengerApi } from '../../../storybook/mocks/FakeAktivitetspengerApi';
import { BehovForBistand } from './BehovForBistand';

const avkortingsperiode = { fom: '2024-01-01', tom: '2024-12-31' };

class FakeApiMedAvkortingsperiode extends FakeAktivitetspengerApi {
  override async hentPerioderSomKanAvkortes() {
    return {
      resultat: [{ vilkårType: vilkarType.BISTANDSVILKÅR, perioder: [avkortingsperiode] }],
    };
  }
}

class FakeApiSomHuskerAksjonspunkt extends FakeApiMedAvkortingsperiode {
  sisteBekreftedeAksjonspunkt: unknown;

  override async bekreftAksjonspunkt(...args: unknown[]): Promise<undefined> {
    const [, , bekreftedeAksjonspunkter] = args;
    this.sisteBekreftedeAksjonspunkt = Array.isArray(bekreftedeAksjonspunkter)
      ? bekreftedeAksjonspunkter[0]
      : undefined;
    return undefined;
  }
}

const fakeApiMedAvkortingsperiode = new FakeApiMedAvkortingsperiode();
const apiSomHusker = new FakeApiSomHuskerAksjonspunkt();

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/BehovForBistand',
  component: BehovForBistand,
  args: {
    api: fakeApiMedAvkortingsperiode,
    behandling: { uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: async () => {},
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

export const MedKunVilkårUtenAksjonspunkt: Story = {
  args: {
    vurderBistandsvilkårAp: undefined,
    lokalkontorForeslårVilkårAp: undefined,
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
    isPermanentlyReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser ikke advarsel når aksjonspunkt mangler', async () => {
      await expect(
        canvas.queryByText('Vurder behov for bistand på søknadstidspunktet.', { exact: false }),
      ).not.toBeInTheDocument();
    });

    await step('viser ikke bekreft-knapp når panelet er permanent låst', async () => {
      await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    });
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
      await expect(canvas.getByLabelText('Til og med')).toBeInTheDocument();
      await expect(canvas.getByRole('checkbox', { name: 'Rediger maksdato' })).toBeInTheDocument();
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

export const AlleredeAvkortet: Story = {
  args: {
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-06-30' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker har behov for bistand.',
        },
        {
          periode: { fom: '2024-07-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          avslagKode: Avslagsårsak.AVKORTET,
          begrunnelse: 'Perioden er avkortet etter avtale med søker.',
        },
      ],
    },
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('slår sammen oppfylt og avkortet periode til én rad', async () => {
      await expect(await canvas.findAllByText('01.01.2024 - 30.06.2024')).not.toHaveLength(0);
    });

    await step('forhåndsutfyller avkortingen fra eksisterende vurdering', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: /Rediger vurdering/ }));
      await expect(await canvas.findByLabelText('Rediger maksdato')).toBeChecked();
      await expect(await canvas.findByLabelText('Til og med')).toHaveValue('30.06.2024');
      await expect(await canvas.findByLabelText('Begrunn kortere periode enn 260 dager')).toHaveValue(
        'Perioden er avkortet etter avtale med søker.',
      );
    });
  },
};

export const RedigererMaksdato: Story = {
  args: {
    api: apiSomHusker,
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [
        {
          periode: avkortingsperiode,
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker har behov for bistand.',
        },
      ],
    },
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    apiSomHusker.sisteBekreftedeAksjonspunkt = undefined;

    await step('maksdato er låst før avkorting er slått på', async () => {
      await expect(await canvas.findByLabelText('Til og med')).toBeDisabled();
      await expect(canvas.queryByLabelText('Begrunn kortere periode enn 260 dager')).not.toBeInTheDocument();
    });

    await step('sender avkortet periode med årsak AVKORTET', async () => {
      await userEvent.click(await canvas.findByLabelText('Rediger maksdato'));

      const maksdato = await canvas.findByLabelText('Til og med');
      await userEvent.clear(maksdato);
      await userEvent.type(maksdato, '30.06.2024');
      await userEvent.type(
        await canvas.findByLabelText('Begrunn kortere periode enn 260 dager'),
        'Søker trenger bistand kortere enn maksperioden.',
      );

      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));

      await waitFor(async () => {
        await expect(apiSomHusker.sisteBekreftedeAksjonspunkt).toEqual({
          '@type': AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
          begrunnelse: 'Søker har behov for bistand.\n\nSøker trenger bistand kortere enn maksperioden.',
          vurdertePerioder: [
            {
              avslagsårsak: undefined,
              begrunnelse: 'Søker har behov for bistand.',
              erVilkårOppfylt: true,
              periode: { fom: '2024-01-01', tom: '2024-06-30' },
              fritekstVurderingBrev: undefined,
            },
            {
              avslagsårsak: BistandsvilkårIkkeOppfyltÅrsak.AVKORTET,
              begrunnelse: 'Søker trenger bistand kortere enn maksperioden.',
              erVilkårOppfylt: false,
              periode: { fom: '2024-07-01', tom: '2024-12-31' },
              fritekstVurderingBrev: undefined,
            },
          ],
        });
      });
    });
  },
};
export const LesevisningViserTekst: Story = {
  args: {
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [
        { periode: avkortingsperiode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har behov for bistand.' },
      ],
    },
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser vurderingen som tekst, ikke som skjemafelter', async () => {
      await expect(await canvas.findByText('Søker har behov for bistand.')).toBeInTheDocument();
      await expect(canvas.getByText('Behov for bistand:')).toBeInTheDocument();
      await expect(canvas.getByText('01.01.2024 – 31.12.2024')).toBeInTheDocument();
      await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
      await expect(canvas.queryByRole('radio')).not.toBeInTheDocument();
    });
  },
};
export const MaksdatoMåVæreKortere: Story = {
  args: {
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [
        { periode: avkortingsperiode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har behov for bistand.' },
      ],
    },
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser valideringsfeil når maksdato ikke faktisk redigeres', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: /Rediger vurdering/ }));
      await userEvent.click(await canvas.findByLabelText('Rediger maksdato'));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await expect(
        canvas.getByText('Velg en tidligere dato, eller fjern avhukingen hvis du vil bruke senest mulig maksdato.'),
      ).toBeInTheDocument();
    });
  },
};
