import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { FakeAktivitetspengerApi } from '../../../storybook/mocks/FakeAktivitetspengerApi';
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

const behandlingId = 1;
const fakeApi = new FakeAktivitetspengerApiMedAvkortingsperiode();

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/Bosted',
  component: Bosted,
  args: {
    api: fakeApi,
    behandling: { id: behandlingId, uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: async () => {},
    lokalkontorForeslårVilkårAp: undefined,
    readOnly: false,
    bostedGrunnlag: { perioder: [] },
  },
} satisfies Meta<typeof Bosted>;
export default meta;

type Story = StoryObj<typeof meta>;

const periode = { fom: '2024-01-01', tom: '2024-12-31' };

const finnDokumentMalTypeKilde = (verdi: unknown): string | undefined => {
  if (Array.isArray(verdi)) {
    for (const element of verdi) {
      const kilde = finnDokumentMalTypeKilde(element);
      if (kilde !== undefined) {
        return kilde;
      }
    }
    return undefined;
  }

  if (typeof verdi !== 'object' || verdi === null) {
    return undefined;
  }

  const dokumentMalType = Reflect.get(verdi, 'dokumentMalType');
  if (typeof dokumentMalType === 'object' && dokumentMalType !== null) {
    const kilde = Reflect.get(dokumentMalType, 'kilde');
    if (typeof kilde === 'string') {
      return kilde;
    }
  }

  for (const element of Object.values(verdi)) {
    const kilde = finnDokumentMalTypeKilde(element);
    if (kilde !== undefined) {
      return kilde;
    }
  }
  return undefined;
};

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
          avslagKode: Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_BOSTED,
        },
      ],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser avslagsårsaken fra backend', async () => {
      await expect(await canvas.findByText('Har ikke bostedsadresse i Trondheim kommune')).toBeInTheDocument();
    });
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
        canvas.queryByText('Vurder om søker er bosatt i Trondheim kommune på virkningstidspunktet.', { exact: false }),
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

export const AvslagMedÅpentLokalkontorForeslår: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [
        {
          periode,
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          avslagKode: Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_BOSTED,
        },
      ],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
    lokalkontorForeslårVilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser beslutter- og forhåndsvisningsknappene ved avslag', async () => {
      await expect(await canvas.findByRole('button', { name: 'Send til beslutter' })).toBeInTheDocument();
      await expect(await canvas.findByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    });

    await step('forhåndsviser vedtaksbrevet med brevvalget fra fake-API-et', async () => {
      const forventetKilde = finnDokumentMalTypeKilde(await fakeApi.vedtaksbrevValg());
      if (forventetKilde === undefined) {
        throw new Error('Fant ikke kilde for dokumentmaltypen i fake-API-et.');
      }

      const forhåndsvisSpy = spyOn(fakeApi, 'forhåndsvisVedtaksbrev');
      const åpneVinduSpy = spyOn(window, 'open').mockReturnValue(window);
      try {
        await userEvent.click(await canvas.findByRole('button', { name: 'Forhåndsvis brev' }));

        await waitFor(async () => {
          await expect(forhåndsvisSpy).toHaveBeenCalledWith(behandlingId, forventetKilde);
          await expect(åpneVinduSpy).toHaveBeenCalledWith(expect.any(String), '_blank');
        });
      } finally {
        forhåndsvisSpy.mockRestore();
        åpneVinduSpy.mockRestore();
      }
    });
  },
};

export const AvslagKunIUtelattPeriode: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [
        { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.OPPFYLT },
        {
          periode: { fom: '2024-07-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          vurderesIBehandlingen: false,
          avslagKode: Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_BOSTED,
        },
      ],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
    lokalkontorForeslårVilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser ikke knapper når avslaget bare gjelder en utelatt periode', async () => {
      await expect(canvas.queryByRole('button', { name: 'Send til beslutter' })).not.toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: 'Forhåndsvis brev' })).not.toBeInTheDocument();
    });
  },
};

export const AvslagMedLokalkontorBeslutter: Story = {
  args: {
    bostedVilkår: {
      vilkarType: vilkarType.BOSTEDSVILKÅR,
      perioder: [
        {
          periode,
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          avslagKode: Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_BOSTED,
        },
      ],
    },
    bostedAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT),
    lokalkontorBeslutterAp: lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR),
    isPermanentlyReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('viser bare forhåndsvisning når lokalkontoret beslutter', async () => {
      await expect(await canvas.findByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: 'Send til beslutter' })).not.toBeInTheDocument();
    });
  },
};
