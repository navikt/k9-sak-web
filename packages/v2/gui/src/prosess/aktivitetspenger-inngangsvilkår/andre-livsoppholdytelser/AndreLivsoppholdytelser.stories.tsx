import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { FakeAktivitetspengerApi } from '../../../storybook/mocks/FakeAktivitetspengerApi';
import { AndreLivsoppholdytelser } from './AndreLivsoppholdytelser';

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
          vilkårType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
          perioder: [{ fom: '2024-01-01', tom: '2024-12-31' }],
        },
      ],
    };
  }
}

class FakeAktivitetspengerApiSomHuskerAksjonspunkt extends FakeAktivitetspengerApiMedAvkortingsperiode {
  sisteBekreftedeAksjonspunkt: unknown;

  override async bekreftAksjonspunkt(...args: unknown[]): Promise<undefined> {
    const [, , bekreftedeAksjonspunkter] = args;
    this.sisteBekreftedeAksjonspunkt = Array.isArray(bekreftedeAksjonspunkter)
      ? bekreftedeAksjonspunkter[0]
      : undefined;
    return undefined;
  }
}

const apiSomHusker = new FakeAktivitetspengerApiSomHuskerAksjonspunkt();

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/AndreLivsoppholdytelser',
  component: AndreLivsoppholdytelser,
  args: {
    api: new FakeAktivitetspengerApiMedAvkortingsperiode(),
    behandling: { uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: async () => {},
    lokalkontorForeslårVilkårAp: undefined,
    readOnly: false,
  },
} satisfies Meta<typeof AndreLivsoppholdytelser>;
export default meta;

type Story = StoryObj<typeof meta>;

const periode = { fom: '2024-01-01', tom: '2024-12-31' };

export const IkkeVurdert: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};

export const Oppfylt: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har ingen andre livsoppholdytelser.' }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};

export const IkkeOppfylt: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [
        {
          periode,
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          begrunnelse: 'Søker mottar dagpenger.',
          avslagKode: '3003',
        },
      ],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har ingen andre livsoppholdytelser.' }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};

export const FlerePerioder: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-06-30' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Ingen andre ytelser.',
        },
        { periode: { fom: '2024-07-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT },
      ],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};

export const MedKunVilkårUtenAksjonspunkt: Story = {
  args: {
    andreLivsoppholdytelserAp: undefined,
    lokalkontorForeslårVilkårAp: undefined,
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har ingen andre livsoppholdytelser.' }],
    },
    isPermanentlyReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser ikke advarsel når aksjonspunkt mangler', async () => {
      await expect(
        canvas.queryByText('Vurder om søker har andre livsoppholdsytelser på søknadstidspunktet.', { exact: false }),
      ).not.toBeInTheDocument();
    });

    await step('viser ikke bekreft-knapp når panelet er permanent låst', async () => {
      await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    });
  },
};

export const AlleredeAvkortet: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-06-30' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker har ingen andre livsoppholdytelser.',
        },
        {
          periode: { fom: '2024-07-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          avslagKode: Avslagsårsak.AVKORTET,
          begrunnelse: 'Perioden er avkortet etter avtale med søker.',
        },
      ],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('slår sammen oppfylt og avkortet periode til én rad', async () => {
      const rader = await canvas.findAllByRole('row');
      // én header-rad + én periode-rad
      await expect(rader).toHaveLength(2);
      await expect(await canvas.findAllByText('01.01.2024 - 30.06.2024')).not.toHaveLength(0);
    });

    await step('forhåndsutfyller avkortingen fra eksisterende vurdering', async () => {
      await expect(await canvas.findByLabelText('Rediger maksdato')).toBeChecked();
      await expect(await canvas.findByLabelText('Maksdato')).toHaveValue('30.06.2024');
      await expect(await canvas.findByLabelText('Begrunn kortere periode enn 260 dager')).toHaveValue(
        'Perioden er avkortet etter avtale med søker.',
      );
    });
  },
};

export const RedigererMaksdato: Story = {
  args: {
    api: apiSomHusker,
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker har ingen andre livsoppholdytelser.',
        },
      ],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    apiSomHusker.sisteBekreftedeAksjonspunkt = undefined;

    await step('maksdato er låst før avkorting er slått på', async () => {
      await expect(await canvas.findByLabelText('Maksdato')).toBeDisabled();
    });

    await step('avkortingsbegrunnelse vises først etter at maksdato kan redigeres', async () => {
      await expect(canvas.queryByLabelText('Begrunn kortere periode enn 260 dager')).not.toBeInTheDocument();

      await userEvent.click(await canvas.findByLabelText('Rediger maksdato'));

      await expect(await canvas.findByLabelText('Maksdato')).toBeEnabled();
      await expect(await canvas.findByLabelText('Begrunn kortere periode enn 260 dager')).toBeInTheDocument();
    });

    await step('sender avkortet periode med årsak AVKORTET', async () => {
      const maksdato = await canvas.findByLabelText('Maksdato');
      await userEvent.clear(maksdato);
      await userEvent.type(maksdato, '30.06.2024');
      await userEvent.type(
        await canvas.findByLabelText('Begrunn kortere periode enn 260 dager'),
        'Søker ønsker kortere periode.',
      );

      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));

      await waitFor(async () => {
        await expect(apiSomHusker.sisteBekreftedeAksjonspunkt).toEqual({
          '@type': AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
          begrunnelse: 'Søker har ingen andre livsoppholdytelser.\n\nSøker ønsker kortere periode.',
          vurdertePerioder: [
            {
              avslagsårsak: undefined,
              begrunnelse: 'Søker har ingen andre livsoppholdytelser.',
              erVilkårOppfylt: true,
              periode: { fom: '2024-01-01', tom: '2024-06-30' },
              fritekstVurderingBrev: undefined,
            },
            {
              avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
              begrunnelse: 'Søker ønsker kortere periode.',
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

export const MaksdatoMåVæreKortere: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har ingen andre livsoppholdytelser.' }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
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

export const LesevisningViserTekst: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har ingen andre livsoppholdytelser.' }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser vurderingen som tekst, ikke som skjemafelter', async () => {
      await expect(await canvas.findByText('Søker har ingen andre livsoppholdytelser.')).toBeInTheDocument();
      await expect(canvas.getByText('Uten andre livsoppholdsytelser:')).toBeInTheDocument();
      await expect(canvas.getByText('01.01.2024 – 31.12.2024')).toBeInTheDocument();
      await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
      await expect(canvas.queryByRole('radio')).not.toBeInTheDocument();
    });
  },
};

export const AvbrytTilbakestillerSkjema: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har ingen andre livsoppholdytelser.' }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('endrer vurderingen uten å bekrefte', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: /Rediger vurdering/ }));
      await userEvent.click(await canvas.findByLabelText('Nei'));
      await expect(await canvas.findByLabelText('Nei')).toBeChecked();
    });

    await step('avbryt tilbakestiller til opprinnelig vurdering', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Avbryt' }));
      await userEvent.click(await canvas.findByRole('button', { name: /Rediger vurdering/ }));

      await expect(await canvas.findByLabelText('Ja')).toBeChecked();
      await expect(canvas.queryByText('Avslagsårsak')).not.toBeInTheDocument();
    });
  },
};
