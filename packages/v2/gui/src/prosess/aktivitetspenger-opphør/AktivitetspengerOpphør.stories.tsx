import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingOperasjonerDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingOperasjonerDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { fakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi.js';
import { AktivitetspengerOpphør } from './AktivitetspengerOpphør.js';

const lagAksjonspunkt = (
  definisjon: AksjonspunktDto['definisjon'],
  status: AksjonspunktDto['status'] = AksjonspunktStatus.OPPRETTET,
): AksjonspunktDto => ({
  definisjon,
  status,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
});

const fakeBehandling = {
  uuid: 'fake-behandling-uuid',
  versjon: 1,
} as BehandlingDto;

const fakeInnloggetBruker = {
  aktivitetspengerDel1SaksbehandlerTilgang: {
    kanSaksbehandle: true,
    kanBeslutte: false,
  },
} satisfies InnloggetAnsattUngV2Dto;

const fakeLovligeBehandlingsoperasjoner = {
  uuid: 'fake-behandling-uuid',
  behandlingTilGodkjenningVedLokalkontor: false,
} satisfies BehandlingOperasjonerDto;

const fakeOpphørVilkår = {
  vilkarType: vilkarType.BOSTEDSVILKÅR,
  lovReferanse: 'TODO AKT lovreferanse',
  overstyrbar: true,
  perioder: [
    {
      vilkarStatus: Utfall.IKKE_VURDERT,
      merknad: '-',
      merknadParametere: {},
      periode: { fom: '2026-01-29', tom: '2027-01-28' },
      begrunnelse: '',
      fritekstVurderingBrev: '',
      vurderesIBehandlingen: true,
    },
  ],
} as unknown as VilkårMedPerioderDto;

const meta = {
  title: 'gui/prosess/aktivitetspenger-opphør/AktivitetspengerOpphør',
  component: AktivitetspengerOpphør,
} satisfies Meta<typeof AktivitetspengerOpphør>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED)],
    innloggetBruker: fakeInnloggetBruker,
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: fn(),
    vilkår: [fakeOpphørVilkår],
    totrinnskontrollSkjermlenkeContext: [] satisfies TotrinnskontrollSkjermlenkeContextDto[],
    lovligeBehandlingsoperasjoner: fakeLovligeBehandlingsoperasjoner,
    bostedGrunnlag: { perioder: [] },
  },
};

const fakeArgsBase = {
  innloggetBruker: fakeInnloggetBruker,
  api: fakeAktivitetspengerApi,
  behandling: fakeBehandling,
  vilkår: [fakeOpphørVilkår],
  totrinnskontrollSkjermlenkeContext: [] satisfies TotrinnskontrollSkjermlenkeContextDto[],
  lovligeBehandlingsoperasjoner: fakeLovligeBehandlingsoperasjoner,
  bostedGrunnlag: { perioder: [] },
};

export const ÅrsakOgVarselOpphøreUtenVarsel: Story = {
  args: {
    ...fakeArgsBase,
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED)],
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('Velg "Opphøre fra en dato"', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Opphøre fra en dato' }));
    });

    await step('Fyll inn opphørsdato', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: /opphøre fra og med/i }), '01.05.2026');
    });

    await step('Velg årsak', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /årsak/i }),
        'Ikke bosatt adresse i Trondheim',
      );
    });

    await step('Fyll inn begrunnelse', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: 'Begrunnelse' }), 'Testbegrunnelse for opphør');
    });

    await step('Svar "Ja" på åpenbar grunn til ikke å varsle', async () => {
      const varsleGroup = canvas.getByRole('radiogroup', { name: /åpenbar grunn/i });
      await userEvent.click(within(varsleGroup).getByRole('radio', { name: 'Ja' }));
    });

    await step('Fyll inn begrunnelse for å ikke varsle', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /begrunnelse for hvorfor det ikke er behov/i }),
        'Bruker varslet om flytting selv',
      );
    });

    await step('Send skjema', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
    });

    await step('Callback er kalt etter innsending', async () => {
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};

export const ÅrsakOgVarselOpphøreMedForhåndsvarsel: Story = {
  args: {
    ...fakeArgsBase,
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED)],
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('Velg "Opphøre fra en dato"', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Opphøre fra en dato' }));
    });

    await step('Fyll inn opphørsdato', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: /opphøre fra og med/i }), '01.05.2026');
    });

    await step('Velg årsak', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /årsak/i }),
        'Ikke bosatt adresse i Trondheim',
      );
    });

    await step('Fyll inn begrunnelse', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: 'Begrunnelse' }), 'Testbegrunnelse for opphør');
    });

    await step('Svar "Nei" — varsel skal sendes', async () => {
      const varsleGroup = canvas.getByRole('radiogroup', { name: /åpenbar grunn/i });
      await userEvent.click(within(varsleGroup).getByRole('radio', { name: 'Nei' }));
    });

    await step('Send skjema — modal skal åpne seg', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
    });

    await step('Modal for forhåndsvarsel er synlig', async () => {
      await expect(canvas.findByRole('dialog', { name: /send forhåndsvarsel/i })).resolves.toBeInTheDocument();
    });

    await step('Bekreft sending i modal', async () => {
      const modal = await canvas.findByRole('dialog');
      await userEvent.click(within(modal).getByRole('button', { name: /send forhåndsvarsel/i }));
    });

    await step('Callback er kalt etter bekreftelse', async () => {
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};

export const VilkårsvurderingFyllUtOgSend: Story = {
  args: {
    ...fakeArgsBase,
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR)],
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('Velg opphørsårsak', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /opphørsårsak/i }),
        'Ikke bosatt adresse i Trondheim',
      );
    });

    await step('Fyll inn begrunnelse', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /vurder om bruker har flyttet/i }),
        'Bruker har ikke lenger bostedsadresse i Trondheim.',
      );
    });

    await step('Velg at bruker ikke bor i Trondheim', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: /nei, bruker bor fortsatt/i }));
    });

    await step('Send til beslutter', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /send til beslutter/i }));
    });

    await step('Callback er kalt etter innsending', async () => {
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};
