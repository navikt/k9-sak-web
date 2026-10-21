import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { AndreLivsoppholdsytelserVurderingDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/vurdering/AndreLivsoppholdsytelserVurderingerResponse.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useQueryClient } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { FakeAktivitetspengerApi } from '../../../storybook/mocks/FakeAktivitetspengerApi';
import { perioderSomKanAvkortesQueryOptions } from '../../aktivitetspenger-prosess/aktivitetspengerQueryOptions';
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

const avkortingsperioder = {
  resultat: [
    {
      vilkårType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ fom: '2024-01-01', tom: '2024-12-31' }],
    },
  ],
};

const lagVurdering = (
  vurdering: Pick<AndreLivsoppholdsytelserVurderingDto, 'periode' | 'erVilkårOppfylt'> &
    Partial<AndreLivsoppholdsytelserVurderingDto>,
): AndreLivsoppholdsytelserVurderingDto => ({
  erManuellVurdering: true,
  vilkårType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  vurdertAv: 'Z123456',
  vurdertTidspunkt: '2024-01-15T10:00:00',
  ...vurdering,
});

class FakeAktivitetspengerApiMedAvkortingsperiode extends FakeAktivitetspengerApi {
  constructor(private readonly vurderinger: AndreLivsoppholdsytelserVurderingDto[] = []) {
    super();
  }

  override async hentPerioderSomKanAvkortes() {
    return avkortingsperioder;
  }

  override async hentAndreLivsoppholdsytelserVurderinger() {
    return { vurderinger: this.vurderinger };
  }
}

// Skjemaet leser avkortingsperioder bare ved første render, så dataene må ligge i cachen før komponenten vises.
const MedForhåndshentetAvkorting = ({
  api,
  behandling,
  children,
}: {
  api: Parameters<typeof perioderSomKanAvkortesQueryOptions>[0];
  behandling: Parameters<typeof perioderSomKanAvkortesQueryOptions>[1];
  children: ReactNode;
}) => {
  const queryClient = useQueryClient();
  const { queryKey } = perioderSomKanAvkortesQueryOptions(api, behandling);
  if (queryClient.getQueryData(queryKey) === undefined) {
    queryClient.setQueryData(queryKey, avkortingsperioder);
  }
  return children;
};

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
const apiSomHuskerMedOppfyltVurdering = new FakeAktivitetspengerApiSomHuskerAksjonspunkt([
  lagVurdering({
    periode: { fom: '2024-01-01', tom: '2024-12-31' },
    erVilkårOppfylt: true,
    begrunnelse: 'Søker har ingen andre livsoppholdytelser.',
  }),
]);

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/AndreLivsoppholdytelser',
  component: AndreLivsoppholdytelser,
  args: {
    api: new FakeAktivitetspengerApiMedAvkortingsperiode(),
    behandling: { id: 1, uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: async () => {},
    lokalkontorForeslårVilkårAp: undefined,
    readOnly: false,
  },
  decorators: [
    (Story, { args }) => (
      <MedForhåndshentetAvkorting api={args.api} behandling={args.behandling}>
        <Suspense fallback="Laster...">
          <Story />
        </Suspense>
      </MedForhåndshentetAvkorting>
    ),
  ],
} satisfies Meta<typeof AndreLivsoppholdytelser>;
export default meta;

type Story = StoryObj<typeof meta>;

const periode = { fom: '2024-01-01', tom: '2024-12-31' };

const apiMedOppfyltVurdering = new FakeAktivitetspengerApiMedAvkortingsperiode([
  lagVurdering({ periode, erVilkårOppfylt: true, begrunnelse: 'Søker har ingen andre livsoppholdytelser.' }),
]);

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
    api: apiMedOppfyltVurdering,
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

export const PeriodeSomIkkeVurderesKanIkkeRedigeres: Story = {
  args: {
    // Endepunktet gir ikke vurderinger for perioder som ikke vurderes i behandlingen
    api: new FakeAktivitetspengerApiMedAvkortingsperiode(),
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [
        {
          periode,
          vilkarStatus: Utfall.OPPFYLT,
          vurderesIBehandlingen: false,
          begrunnelse: 'Søker har ingen andre livsoppholdytelser.',
        },
      ],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: /Rediger vurdering/ })).not.toBeInTheDocument();
    await expect(await canvas.findByText('Søker har ingen andre livsoppholdytelser.')).toBeInTheDocument();
  },
};

const apiSomHuskerMedLagretAvslag = new FakeAktivitetspengerApiSomHuskerAksjonspunkt([
  lagVurdering({
    periode,
    erVilkårOppfylt: false,
    begrunnelse: 'Søker mottar kommunal støtte.',
    avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE,
    ytelseNavn: 'Kommunal støtte',
    fritekstVurderingBrev: 'Du mottar kommunal støtte.',
  }),
]);

export const BevarerLagretAvslagVedNyInnsending: Story = {
  args: {
    api: apiSomHuskerMedLagretAvslag,
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [
        { periode, vilkarStatus: Utfall.IKKE_OPPFYLT, avslagKode: Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE },
      ],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    apiSomHuskerMedLagretAvslag.sisteBekreftedeAksjonspunkt = undefined;

    await step('skjemaet er forhåndsutfylt med lagret ytelse og fritekst', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: /Rediger vurdering/ }));
      await expect(await canvas.findByRole('textbox', { name: 'Skriv inn hvilken ytelse' })).toHaveValue(
        'Kommunal støtte',
      );
      await expect(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev')).toBeChecked();
      await expect(canvas.getByRole('textbox', { name: 'Fritekst avslagsbrev' })).toHaveValue(
        'Du mottar kommunal støtte.',
      );
    });

    await step('ny innsending uten endringer sender de lagrede verdiene', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(async () => {
        await expect(apiSomHuskerMedLagretAvslag.sisteBekreftedeAksjonspunkt).toEqual(
          expect.objectContaining({
            vurdertePerioder: [
              {
                avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE,
                ytelseNavn: 'Kommunal støtte',
                begrunnelse: 'Søker mottar kommunal støtte.',
                erVilkårOppfylt: false,
                periode,
                fritekstVurderingBrev: 'Du mottar kommunal støtte.',
              },
            ],
          }),
        );
      });
    });
  },
};

export const IkkeOppfylt: Story = {
  args: {
    api: new FakeAktivitetspengerApiMedAvkortingsperiode([
      lagVurdering({
        periode,
        erVilkårOppfylt: false,
        begrunnelse: 'Søker mottar dagpenger.',
        avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE,
        ytelseNavn: 'Dagpenger',
      }),
    ]),
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
    api: apiMedOppfyltVurdering,
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
    api: new FakeAktivitetspengerApiMedAvkortingsperiode([
      lagVurdering({
        periode: { fom: '2024-01-01', tom: '2024-06-30' },
        erVilkårOppfylt: true,
        begrunnelse: 'Ingen andre ytelser.',
      }),
    ]),
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
    api: apiMedOppfyltVurdering,
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
        canvas.queryByText('Vurder om søker har andre livsoppholdsytelser på virkningstidspunktet.', { exact: false }),
      ).not.toBeInTheDocument();
    });

    await step('viser ikke bekreft-knapp når panelet er permanent låst', async () => {
      await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    });
  },
};

export const AlleredeAvkortet: Story = {
  args: {
    api: new FakeAktivitetspengerApiMedAvkortingsperiode([
      lagVurdering({
        periode: { fom: '2024-01-01', tom: '2024-06-30' },
        erVilkårOppfylt: true,
        begrunnelse: 'Søker har ingen andre livsoppholdytelser.',
      }),
      lagVurdering({
        periode: { fom: '2024-07-01', tom: '2024-12-31' },
        erVilkårOppfylt: false,
        avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
        begrunnelse: 'Perioden er avkortet etter avtale med søker.',
      }),
    ]),
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
      await userEvent.click(await canvas.findByRole('button', { name: /Rediger vurdering/ }));
      await expect(await canvas.findByLabelText('Rediger til og med')).toBeChecked();
      await expect(await canvas.findByLabelText('Til og med')).toHaveValue('30.06.2024');
      await expect(await canvas.findByLabelText('Begrunn kortere periode enn 260 dager')).toHaveValue(
        'Perioden er avkortet etter avtale med søker.',
      );
    });
  },
};

export const RedigererMaksdato: Story = {
  args: {
    api: apiSomHuskerMedOppfyltVurdering,
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
    apiSomHuskerMedOppfyltVurdering.sisteBekreftedeAksjonspunkt = undefined;

    await step('maksdato er låst før avkorting er slått på', async () => {
      await userEvent.click(await canvas.findByLabelText('Rediger vurdering'));
      await expect(await canvas.findByLabelText('Til og med')).toBeDisabled();
    });

    await step('avkortingsbegrunnelse vises først etter at maksdato kan redigeres', async () => {
      await expect(canvas.queryByLabelText('Begrunn kortere periode enn 260 dager')).not.toBeInTheDocument();
      await userEvent.click(await canvas.findByLabelText('Rediger til og med'));

      await expect(await canvas.findByLabelText('Til og med')).toBeEnabled();
      await expect(await canvas.findByLabelText('Begrunn kortere periode enn 260 dager')).toBeInTheDocument();
    });

    await step('sender avkortet periode med årsak AVKORTET', async () => {
      const maksdato = await canvas.findByLabelText('Til og med');
      await userEvent.clear(maksdato);
      await userEvent.type(maksdato, '01.07.2024');
      await userEvent.type(
        await canvas.findByLabelText('Begrunn kortere periode enn 260 dager'),
        'Søker ønsker kortere periode.',
      );

      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));

      await waitFor(async () => {
        await expect(apiSomHuskerMedOppfyltVurdering.sisteBekreftedeAksjonspunkt).toEqual({
          '@type': AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
          begrunnelse: 'Aksjonspunkt 5142 VURDER_ANDRE_LIVSOPPHOLDSYTELSER bekreftet',
          vurdertePerioder: [
            {
              avslagsårsak: undefined,
              begrunnelse: 'Søker har ingen andre livsoppholdytelser.',
              erVilkårOppfylt: true,
              periode: { fom: '2024-01-01', tom: '2024-07-01' },
              fritekstVurderingBrev: undefined,
            },
            {
              avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
              begrunnelse: 'Søker ønsker kortere periode.',
              erVilkårOppfylt: false,
              periode: { fom: '2024-07-02', tom: '2024-12-31' },
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
    api: apiMedOppfyltVurdering,
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
      await userEvent.click(await canvas.findByLabelText('Rediger til og med'));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await expect(
        canvas.getByText(
          'Velg en tidligere dato, eller fjern avhukingen hvis du vil bruke senest mulig "til og med" dato.',
        ),
      ).toBeInTheDocument();
    });
  },
};

export const AvslagMedÅpentLokalkontorForeslår: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [
        {
          periode,
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          avslagKode: Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE,
        },
      ],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    lokalkontorForeslårVilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser beslutter- og forhåndsvisningsknappene ved avslag', async () => {
      await expect(await canvas.findByRole('button', { name: 'Send til beslutter' })).toBeInTheDocument();
      await expect(await canvas.findByRole('button', { name: 'Forhåndsvis vedtaksbrev' })).toBeInTheDocument();
    });
  },
};

export const LesevisningViserTekst: Story = {
  args: {
    api: apiMedOppfyltVurdering,
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
    api: apiMedOppfyltVurdering,
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

export const AnnenYtelseMedFritekst: Story = {
  args: {
    api: apiSomHusker,
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    apiSomHusker.sisteBekreftedeAksjonspunkt = undefined;

    await step('Åpne hjelpeteksten', async () => {
      await userEvent.click(
        await canvas.findByRole('button', { name: 'Hvilke ytelser kan bruker motta samtidig som aktivitetspenger?' }),
      );
      await expect(canvas.getByText(/Aktivitetspenger kan som hovedregel ikke mottas samtidig/)).toBeInTheDocument();
    });

    await step('Velg annen ytelse', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /Vurder om søker mottar andre livsoppholdsytelser/ }),
        'Søker mottar en ytelse som ikke står i listen.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: 'Hvilken ytelse mottar bruker?' }),
        AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE,
      );
      await userEvent.type(canvas.getByRole('textbox', { name: 'Skriv inn hvilken ytelse' }), 'Kommunal støtte');
    });

    await step('Legg til fritekst i avslagsbrevet', async () => {
      await expect(canvas.queryByRole('textbox', { name: 'Fritekst avslagsbrev' })).not.toBeInTheDocument();
      await userEvent.click(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev'));
      await userEvent.type(
        canvas.getByRole('textbox', { name: 'Fritekst avslagsbrev' }),
        'Søker mottar kommunal støtte.',
      );
    });

    await step('Kontroller innsendingen', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(async () => {
        await expect(apiSomHusker.sisteBekreftedeAksjonspunkt).toEqual(
          expect.objectContaining({
            vurdertePerioder: [
              expect.objectContaining({
                ytelseNavn: 'Kommunal støtte',
                fritekstVurderingBrev: 'Søker mottar kommunal støtte.',
              }),
            ],
          }),
        );
      });
    });
  },
};
