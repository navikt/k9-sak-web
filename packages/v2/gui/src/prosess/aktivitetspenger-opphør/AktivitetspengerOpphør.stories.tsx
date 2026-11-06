/* eslint-disable storybook/prefer-pascal-case */
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingÅrsakType.js';
import { AktivitetsvilkåretIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AktivitetsvilkåretIkkeOppfyltÅrsak.js';
import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avklaringtype.js';
import { BistandsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BistandsvilkårIkkeOppfyltÅrsak.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingOperasjonerDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingOperasjonerDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type {
  VilkårsavklaringerDto,
  VilkårsavklaringVurderingerDto,
} from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { FakeAktivitetspengerApi, fakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
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
  status: BehandlingStatus.OPPRETTET,
  behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.ENDRET_BOSTED }],
} as BehandlingDto;

const fakeAndreLivsoppholdytelserBehandling = {
  ...fakeBehandling,
  behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.ENDRET_LIVSOPPHOLDSYTELSE }],
} as BehandlingDto;

const fakeInnloggetBruker = {
  aktivitetspengerDel1SaksbehandlerTilgang: {
    kanSaksbehandle: true,
    kanBeslutte: false,
  },
} satisfies InnloggetAnsattUngV2Dto;

const fakeLovligeBehandlingsoperasjoner = {
  uuid: 'fake-behandling-uuid',
  behandlingTilGodkjenningVedNavKontor: false,
} satisfies BehandlingOperasjonerDto;

const fakeBostedVilkår = {
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

const fakeBostedVilkårsavklaringer = {
  vilkårType: vilkarType.BOSTEDSVILKÅR,
  perioder: [{ periode: { fom: '2026-01-29', tom: '2027-01-28' }, utfall: Utfall.OPPFYLT }],
} satisfies VilkårsavklaringerDto;

const lagFakeBostedVilkårsavklaringVurderinger = (
  ikkeOppfyltÅrsak: BostedsvilkårIkkeOppfyltÅrsak,
): VilkårsavklaringVurderingerDto => ({
  vilkårType: vilkarType.BOSTEDSVILKÅR,
  perioder: [
    {
      periode: { fom: '2026-01-29', tom: '2027-01-28' },
      utfall: Utfall.IKKE_VURDERT,
      vurderesIBehandlingen: true,
      avklaringOgVurdering: {
        avklaring: {
          avklaringtype: Avklaringtype.OPPHØR,
          foreslåttIBehandlingen: true,
          ikkeOppfyltÅrsak,
          kilde: 'BRUKER',
          periode: { fom: '2026-01-29', tom: '2027-01-28' },
          referanse: 'bosted-ref',
          skalSendeVarsel: false,
          vurdertAv: 'Z123456',
          vurdertTidspunkt: '2026-01-29T10:00:00',
        },
      },
    },
  ],
});

const lagFakeBostedApi = (
  vilkårsavklaringVurderinger: VilkårsavklaringVurderingerDto = lagFakeBostedVilkårsavklaringVurderinger(
    BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM,
  ),
): AktivitetspengerApi =>
  Object.assign(Object.create(fakeAktivitetspengerApi), {
    bekreftAksjonspunkt: fn(),
    hentVilkårsavklaringer: async () => fakeBostedVilkårsavklaringer,
    hentVilkårsavklaringVurderinger: async () => vilkårsavklaringVurderinger,
  });

const fakeBostedApi = lagFakeBostedApi();

const fakeAndreLivsoppholdytelserVilkår = {
  vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
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

const fakeAndreLivsoppholdytelserVilkårsavklaringer = {
  vilkårType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  perioder: [{ periode: { fom: '2026-01-29', tom: '2027-01-28' }, utfall: Utfall.OPPFYLT }],
} satisfies VilkårsavklaringerDto;

const fakeAndreLivsoppholdytelserApi: AktivitetspengerApi = Object.assign(Object.create(fakeAktivitetspengerApi), {
  hentVilkårsavklaringer: async () => fakeAndreLivsoppholdytelserVilkårsavklaringer,
});

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
    api: fakeBostedApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: fn(),
    vilkår: [fakeBostedVilkår],
    totrinnskontrollSkjermlenkeContext: [] satisfies TotrinnskontrollSkjermlenkeContextDto[],
    lovligeBehandlingsoperasjoner: fakeLovligeBehandlingsoperasjoner,
  },
};

const fakeArgsBase = {
  innloggetBruker: fakeInnloggetBruker,
  api: fakeBostedApi,
  behandling: fakeBehandling,
  vilkår: [fakeBostedVilkår],
  totrinnskontrollSkjermlenkeContext: [] satisfies TotrinnskontrollSkjermlenkeContextDto[],
  lovligeBehandlingsoperasjoner: fakeLovligeBehandlingsoperasjoner,
};

const fakeBehandlingMedId = { ...fakeBehandling, id: 123 };

const fakeBostedVilkårMedHistoriskePerioder = {
  vilkarType: vilkarType.BOSTEDSVILKÅR,
  lovReferanse: 'TODO AKT lovreferanse',
  overstyrbar: true,
  perioder: [
    {
      vilkarStatus: Utfall.OPPFYLT,
      merknad: '-',
      merknadParametere: {},
      periode: { fom: '2025-01-01', tom: '2025-12-31' },
      begrunnelse: 'Historisk vurdering',
      fritekstVurderingBrev: '',
      vurderesIBehandlingen: false,
    },
    {
      vilkarStatus: Utfall.OPPFYLT,
      merknad: '-',
      merknadParametere: {},
      periode: { fom: '2026-01-01', tom: '2026-12-31' },
      begrunnelse: 'Vurdering i behandlingen',
      fritekstVurderingBrev: '',
      vurderesIBehandlingen: true,
    },
  ],
} satisfies VilkårMedPerioderDto;

const apiMedForhåndsvisningsspion = new FakeAktivitetspengerApi();
apiMedForhåndsvisningsspion.forhåndsvisVedtaksbrev = fn(async () => new Blob());

const mockWindowOpen = () => {
  const windowOpenSpy = spyOn(window, 'open').mockReturnValue(window);
  return () => windowOpenSpy.mockRestore();
};

const fakeAndreLivsoppholdytelserVilkårArgsBase = {
  ...fakeArgsBase,
  behandling: fakeAndreLivsoppholdytelserBehandling,
  vilkår: [fakeAndreLivsoppholdytelserVilkår],
  aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER)],
  api: Object.assign(Object.create(fakeAktivitetspengerApi), {
    bekreftAksjonspunkt: fn(),
    hentVilkårsavklaringVurderinger: fn(async () => ({
      perioder: [{ periode: { fom: '2026-01-29', tom: '2027-01-28' }, utfall: Utfall.IKKE_VURDERT }],
      vilkårType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
    })),
  }) as AktivitetspengerApi,
  onAksjonspunktBekreftet: fn(),
};

const findVarselRadiogroup = (canvas: { getByText: (matcher: RegExp) => HTMLElement }) => {
  const varsleGroup = canvas.getByText(/skal du sende varsel om opphør\?/i).closest('fieldset');
  if (!varsleGroup) {
    throw new Error('Fant ikke radiogruppen for "Skal du sende varsel om opphør?"');
  }
  return varsleGroup;
};

export const ÅrsakOgVarselOpphoreUtenVarsel: Story = {
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
        BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM,
      );
    });

    await step('Velg kilde til opplysningene', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i }),
        'Bruker',
      );
    });

    await step('Svar "Nei" — varsel skal ikke sendes', async () => {
      const varsleGroup = findVarselRadiogroup(canvas);
      await userEvent.click(within(varsleGroup).getByRole('radio', { name: 'Nei' }));
    });

    await step('Fyll inn begrunnelse for å ikke varsle', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /begrunnelse for hvorfor det ikke er behov for varsel/i }),
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
  play: async ({ canvas, canvasElement, step, args }) => {
    await step('Velg "Opphøre fra en dato"', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Opphøre fra en dato' }));
    });

    await step('Fyll inn opphørsdato', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: /opphøre fra og med/i }), '01.05.2026');
    });

    await step('Velg årsak', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /årsak/i }),
        BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM,
      );
    });

    await step('Velg kilde til opplysningene', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i }),
        'Bruker',
      );
    });

    await step('Svar "Ja" — varsel skal sendes', async () => {
      const varsleGroup = findVarselRadiogroup(canvas);
      await userEvent.click(within(varsleGroup).getByRole('radio', { name: 'Ja' }));
    });

    await step('Send skjema — modal skal åpne seg', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
    });

    await step('Modal for forhåndsvarsel er synlig', async () => {
      await expect(
        within(canvasElement.ownerDocument.body).findByRole('dialog', { name: /send forhåndsvarsel/i }),
      ).resolves.toBeInTheDocument();
    });

    await step('Bekreft sending i modal', async () => {
      const modal = await within(canvasElement.ownerDocument.body).findByRole('dialog', {
        name: /send forhåndsvarsel/i,
      });
      await userEvent.click(within(modal).getByRole('button', { name: /send forhåndsvarsel/i }));
    });

    await step('Callback er kalt etter bekreftelse', async () => {
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};

export const ÅrsakOgVarselKildeAnnetKreverFritekst: Story = {
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
        BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM,
      );
    });

    await step('Fritekstfeltet er skjult før "Annet" er valgt', async () => {
      await expect(canvas.queryByRole('textbox', { name: /skriv inn hvor du har fått opplysningene fra/i })).toBeNull();
    });

    await step('Velg kilde "Annet"', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i }),
        'Annet',
      );
    });

    await step('Fyll inn hvor opplysningene kommer fra', async () => {
      await userEvent.type(
        await canvas.findByRole('textbox', { name: /skriv inn hvor du har fått opplysningene fra/i }),
        'Opplyst av veileder ved lokalkontoret',
      );
    });

    await step('Svar "Nei" — varsel skal ikke sendes', async () => {
      const varsleGroup = findVarselRadiogroup(canvas);
      await userEvent.click(within(varsleGroup).getByRole('radio', { name: 'Nei' }));
    });

    await step('Fyll inn begrunnelse for å ikke varsle', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /begrunnelse for hvorfor det ikke er behov for varsel/i }),
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

const fakeAndreLivsoppholdytelserArgsBase = {
  ...fakeArgsBase,
  api: fakeAndreLivsoppholdytelserApi,
  behandling: fakeAndreLivsoppholdytelserBehandling,
  vilkår: [fakeAndreLivsoppholdytelserVilkår],
  aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER)],
  onAksjonspunktBekreftet: fn(),
};

export const AndreLivsoppholdytelser: Story = {
  args: fakeAndreLivsoppholdytelserArgsBase,
  play: async ({ canvas, step }) => {
    await step('Velg den nye perioden som ikke er satt', async () => {
      await userEvent.click(await canvas.findByRole('row', { name: /ikke satt/i }));
    });

    await step('Skjemaet viser feltet for livsoppholdytelse', async () => {
      const ytelse = canvas.getByRole('combobox', { name: /hvilken ytelse mottar bruker/i });
      await expect(ytelse).toBeInTheDocument();
      await expect(ytelse).toHaveValue('');
    });

    await step('Velg arbeidsavklaringspenger', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /hvilken ytelse mottar bruker/i }),
        AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ARBEIDSAVKLARINGSPENGER,
      );
    });
  },
};

const fakeVilkårsavklaringer = {
  vilkårType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  perioder: [
    {
      periode: { fom: '2026-01-29', tom: '2026-12-31' },
      utfall: Utfall.IKKE_OPPFYLT,
      avklaring: {
        avklaringtype: Avklaringtype.OPPHØR,
        begrunnelseIkkeVarsel: 'Bruker varslet om endringen selv.',
        fritekstTilVarsel: 'Arbeidsavklaringspenger',
        ikkeOppfyltÅrsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE,
        kilde: 'NAV',
        periode: { fom: '2026-01-29', tom: '2026-12-31' },
        referanse: 'andre-livsoppholdsytelser-ref',
        skalSendeVarsel: false,
        foreslåttIBehandlingen: true,
        vurdertAv: 'Z123456',
        vurdertTidspunkt: '2026-01-29T10:00:00',
      },
    },
  ],
} satisfies VilkårsavklaringerDto;

export const AndreLivsoppholdytelserPreutfylt: Story = {
  tags: ['avklarings-prefill-test'],
  args: {
    ...fakeAndreLivsoppholdytelserArgsBase,
    behandling: { ...fakeAndreLivsoppholdytelserBehandling, uuid: 'fake-preutfylt-behandling' },
    api: Object.assign(Object.create(fakeAktivitetspengerApi), {
      hentVilkårsavklaringer: fn(async () => fakeVilkårsavklaringer),
    }) as AktivitetspengerApi,
  },
  play: async ({ canvas, step }) => {
    await step('Velg perioden fra avklaringen', async () => {
      await userEvent.click(canvas.getByRole('row', { name: /29\.01\.2026/i }));
    });

    await step('Vurderte perioder starter i lesevisning og kan redigeres', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: /rediger vurdering/i }));
    });

    await step('Perioden og feltene er forhåndsutfylt', async () => {
      await expect(canvas.getByRole('radio', { name: 'Opphøre fra en dato' })).toBeChecked();
      await expect(canvas.getByRole('combobox', { name: /hvilken ytelse mottar bruker/i })).toHaveValue(
        AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE,
      );
      await expect(canvas.getByRole('textbox', { name: /skriv inn hvilken ytelse/i })).toHaveValue(
        'Arbeidsavklaringspenger',
      );
      await expect(canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i })).toHaveValue('NAV');
      await expect(canvas.getByRole('radio', { name: 'Nei' })).toBeChecked();
      await expect(
        canvas.getByRole('textbox', { name: /begrunnelse for hvorfor det ikke er behov for varsel/i }),
      ).toHaveValue('Bruker varslet om endringen selv.');
    });
  },
};

export const AndreLivsoppholdytelserMedForhåndsvarsel: Story = {
  args: {
    ...fakeAndreLivsoppholdytelserArgsBase,
    api: Object.assign(Object.create(fakeAndreLivsoppholdytelserApi), {
      bekreftAksjonspunkt: fn(),
    }) as AktivitetspengerApi,
  },
  play: async ({ canvas, canvasElement, step, args }) => {
    await step('Velg den nye perioden som ikke er satt', async () => {
      await userEvent.click(await canvas.findByRole('row', { name: /ikke satt/i }));
    });

    await step('Velg opphør fra en dato', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Opphøre fra en dato' }));
      const opphørsdato = canvas.getByRole('textbox', { name: /opphøre fra og med/i });

      await userEvent.clear(opphørsdato);
      await userEvent.type(opphørsdato, '01.05.2026');
    });

    await step('Velg annen livsoppholdytelse', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /hvilken ytelse mottar bruker/i }),
        AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ARBEIDSAVKLARINGSPENGER,
      );
    });

    await step('Velg kilde og svar at bruker skal varsles', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i }),
        'NAV',
      );
      const varsleGroup = findVarselRadiogroup(canvas);
      await userEvent.click(within(varsleGroup).getByRole('radio', { name: 'Ja' }));
    });

    await step('Åpne og bekreft forhåndsvarsel', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
      const modal = await within(canvasElement.ownerDocument.body).findByRole('dialog', {
        name: /send forhåndsvarsel/i,
      });
      await userEvent.click(within(modal).getByRole('button', { name: /send forhåndsvarsel/i }));
    });

    await step('Payload sendes til riktig aksjonspunkt', async () => {
      await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
        fakeAndreLivsoppholdytelserBehandling.uuid,
        fakeAndreLivsoppholdytelserBehandling.versjon,
        [expect.objectContaining({ '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER })],
      );
    });
  },
};

export const AndreLivsoppholdytelserVilkårsvurdering: Story = {
  args: fakeAndreLivsoppholdytelserVilkårArgsBase,
  play: async ({ canvas, step, args }) => {
    await step('Åpne Vilkårsvurdering-fanen', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Vilkårsvurdering' }));
    });

    await step('Hent vurderinger fra endepunktet', async () => {
      await expect(args.api.hentVilkårsavklaringVurderinger).toHaveBeenCalledWith(
        fakeAndreLivsoppholdytelserBehandling.uuid,
        vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      );
    });

    await step('Fyll inn vurderingens begrunnelse', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /vurder om bruker mottar annen livoppholdsytelse/i }),
        'Bruker mottar arbeidsavklaringspenger.',
      );
    });

    await step('Velg at bruker mottar annen livsoppholdsytelse', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: /ja, fra og med/i }));
    });

    await step('Vis fritekstfeltet når avhukingen velges', async () => {
      await expect(canvas.queryByRole('textbox', { name: 'Fritekst opphørsbrev' })).not.toBeInTheDocument();
      await userEvent.click(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev'));
      await expect(canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' })).toBeInTheDocument();
    });

    await step('Fyll inn fritekst til opphørsbrev', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' }),
        'Søker mottar arbeidsavklaringspenger.',
      );
    });

    await step('Send vurderingen til beslutter', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
      await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
        fakeAndreLivsoppholdytelserBehandling.uuid,
        fakeAndreLivsoppholdytelserBehandling.versjon,
        [
          expect.objectContaining({
            vurdertePerioder: [
              expect.objectContaining({
                erVilkårOppfylt: false,
                fritekstVurderingBrev: 'Søker mottar arbeidsavklaringspenger.',
              }),
            ],
          }),
        ],
      );
    });
  },
};

export const AndreLivsoppholdytelserVilkårsvurderingUtenFritekst: Story = {
  ...AndreLivsoppholdytelserVilkårsvurdering,
  play: async ({ canvas, step, args }) => {
    await step('Åpne Vilkårsvurdering-fanen', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Vilkårsvurdering' }));
    });
    await userEvent.type(
      canvas.getByRole('textbox', { name: /vurder om bruker mottar annen livoppholdsytelse/i }),
      'Bruker mottar arbeidsavklaringspenger.',
    );
    await userEvent.click(canvas.getByRole('radio', { name: /ja, fra og med/i }));
    await userEvent.click(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev'));
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' }),
      'Teksten skal ikke bli med etter at avhukingen fjernes.',
    );
    await userEvent.click(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev'));
    await expect(canvas.queryByRole('textbox', { name: 'Fritekst opphørsbrev' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
    await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
      fakeAndreLivsoppholdytelserBehandling.uuid,
      fakeAndreLivsoppholdytelserBehandling.versjon,
      [
        expect.objectContaining({
          vurdertePerioder: [
            expect.objectContaining({
              erVilkårOppfylt: false,
              fritekstVurderingBrev: undefined,
            }),
          ],
        }),
      ],
    );
  },
};

export const AndreLivsoppholdytelserVilkårsvurderingByttTilNeiFjernerFritekst: Story = {
  ...AndreLivsoppholdytelserVilkårsvurdering,
  play: async ({ canvas, step, args }) => {
    await step('Åpne Vilkårsvurdering-fanen', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Vilkårsvurdering' }));
    });

    await step('Fyll inn vurderingens begrunnelse', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /vurder om bruker mottar annen livoppholdsytelse/i }),
        'Bruker mottar arbeidsavklaringspenger.',
      );
    });

    await step('Velg at bruker mottar annen livsoppholdsytelse', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: /ja, fra og med/i }));
    });

    await step('Legg til fritekst i opphørsbrevet', async () => {
      await userEvent.click(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev'));
      await userEvent.type(canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' }), 'Tidligere fritekst.');
    });

    await step('Bytt til nei og skjul fritekstfeltet', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await expect(canvas.queryByRole('textbox', { name: 'Fritekst opphørsbrev' })).not.toBeInTheDocument();
    });

    await step('Bekreft vurderingen uten fritekst i payloaden', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
      await waitFor(async () => {
        await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
          fakeAndreLivsoppholdytelserBehandling.uuid,
          fakeAndreLivsoppholdytelserBehandling.versjon,
          [
            expect.objectContaining({
              vurdertePerioder: [
                expect.objectContaining({
                  erVilkårOppfylt: true,
                  fritekstVurderingBrev: undefined,
                }),
              ],
            }),
          ],
        );
      });
    });
  },
};

export const AndreLivsoppholdytelserVilkårsvurderingLåst: Story = {
  args: {
    ...fakeAndreLivsoppholdytelserVilkårArgsBase,
    aksjonspunkter: [
      lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER_OPPHØR, AksjonspunktStatus.UTFØRT),
    ],
  },
  play: async ({ canvas, step }) => {
    await step('Vilkårsvurdering-fanen er valgt', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Vilkårsvurdering' }));
    });

    await step('Skjemaet er låst etter vurdering', async () => {
      await expect(canvas.getByText('Vilkårsvurdering')).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: /bekreft og fortsett/i })).not.toBeInTheDocument();
    });
  },
};

export const VilkårsvurderingFyllUtOgSend: Story = {
  args: {
    ...fakeArgsBase,
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR)],
    api: lagFakeBostedApi(),
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('Fyll inn begrunnelse', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /vurder om bruker har flyttet/i }),
        'Bruker har ikke lenger bostedsadresse i Trondheim.',
      );
    });

    await step('Velg at bruker ikke bor i Trondheim', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: /nei, bruker bor fortsatt/i }));
    });

    await step('Bekreft og fortsett', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Bekreft og fortsett/i }));
    });

    await step('Callback er kalt etter innsending', async () => {
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });

    await step('Payload inneholder ikke tom fritekst', async () => {
      await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(fakeBehandling.uuid, fakeBehandling.versjon, [
        expect.objectContaining({
          vurdertePerioder: [
            expect.objectContaining({
              erVilkårOppfylt: true,
              fritekstVurderingBrev: undefined,
            }),
          ],
        }),
      ]);
    });
  },
};

export const VilkårsvurderingFlyttetMedFritekst: Story = {
  args: {
    ...fakeArgsBase,
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR)],
    api: lagFakeBostedApi(lagFakeBostedVilkårsavklaringVurderinger(BostedsvilkårIkkeOppfyltÅrsak.ANNET)),
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('Fyll inn begrunnelse', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /vurder om bruker har flyttet/i }),
        'Bruker har flyttet fra Trondheim kommune.',
      );
    });

    await step('Velg at bruker har flyttet fra Trondheim', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: /ja, fra og med/i }));
    });

    await step('Vis fritekstfeltet for årsaken Annet', async () => {
      await expect(canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' })).toBeInTheDocument();
    });

    await step('Fyll inn fritekst til opphørsbrev', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' }),
        'Bruker har flyttet fra Trondheim kommune.',
      );
    });

    await step('Bekreft og fortsett', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Bekreft og fortsett/i }));
    });

    await step('Payload inneholder fritekst til opphørsbrev', async () => {
      await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(fakeBehandling.uuid, fakeBehandling.versjon, [
        expect.objectContaining({
          vurdertePerioder: [
            expect.objectContaining({
              erVilkårOppfylt: false,
              fritekstVurderingBrev: 'Bruker har flyttet fra Trondheim kommune.',
            }),
          ],
        }),
      ]);
    });
  },
};

export const VilkårsvurderingFlyttetUtenFritekst: Story = {
  ...VilkårsvurderingFyllUtOgSend,
  play: async ({ canvas, step, args }) => {
    await step('Fyll inn begrunnelse og velg flytting', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /vurder om bruker har flyttet/i }),
        'Bruker har flyttet fra Trondheim kommune.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: /ja, fra og med/i }));
      await userEvent.click(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev'));
      await userEvent.type(
        canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' }),
        'Teksten skal ikke bli med etter at avhukingen fjernes.',
      );
      await userEvent.click(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev'));
      await expect(canvas.queryByRole('textbox', { name: 'Fritekst opphørsbrev' })).not.toBeInTheDocument();
    });

    await step('Bekreft uten fritekst', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Bekreft og fortsett/i }));
      await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(fakeBehandling.uuid, fakeBehandling.versjon, [
        expect.objectContaining({
          vurdertePerioder: [
            expect.objectContaining({
              erVilkårOppfylt: false,
              fritekstVurderingBrev: undefined,
            }),
          ],
        }),
      ]);
    });
  },
};

const fakeInnloggetBrukerSomKanBeslutte = {
  aktivitetspengerDel1SaksbehandlerTilgang: {
    kanSaksbehandle: false,
    kanBeslutte: true,
  },
} satisfies InnloggetAnsattUngV2Dto;

const fakeLovligeBehandlingsoperasjonerTilGodkjenning = {
  uuid: 'fake-behandling-uuid',
  behandlingTilGodkjenningVedNavKontor: true,
} satisfies BehandlingOperasjonerDto;

const fakeTotrinnskontrollContext: TotrinnskontrollSkjermlenkeContextDto[] = [
  {
    skjermlenkeType: 'OPPHØR',
    totrinnskontrollAksjonspunkter: [
      { aksjonspunktKode: AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED },
      { aksjonspunktKode: AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR },
    ],
  },
];

const fakeBeslutterArgsBase = {
  ...fakeArgsBase,
  innloggetBruker: fakeInnloggetBrukerSomKanBeslutte,
  lovligeBehandlingsoperasjoner: fakeLovligeBehandlingsoperasjonerTilGodkjenning,
  totrinnskontrollSkjermlenkeContext: fakeTotrinnskontrollContext,
  aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR)],
};

export const BeslutterGodkjennerAlle: Story = {
  args: {
    ...fakeBeslutterArgsBase,
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('Viser fom-dato for vilkårsperioden som vurderes', async () => {
      await expect(canvas.getByText('29.01.2026')).toBeInTheDocument();
    });

    await step('Godkjenn Årsak og varsel', async () => {
      const godkjentRadioer = canvas.getAllByRole('radio', { name: 'Godkjent' });
      await userEvent.click(godkjentRadioer[0]!);
    });

    await step('Godkjenn Vilkårsvurdering', async () => {
      const godkjentRadioer = canvas.getAllByRole('radio', { name: 'Godkjent' });
      await userEvent.click(godkjentRadioer[1]!);
    });

    await step('Send inn skjema', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft/i }));
    });

    await step('Callback er kalt etter godkjenning', async () => {
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};

export const MedUtførtBeslutterAksjonspunkt: Story = {
  args: {
    ...fakeBeslutterArgsBase,
    aksjonspunkter: [
      lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR, AksjonspunktStatus.UTFØRT),
      lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR, AksjonspunktStatus.UTFØRT),
    ],
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('tab', { name: 'Beslutter' })).not.toBeInTheDocument();
    await expect(canvas.getAllByRole('tabpanel', { hidden: true })).toHaveLength(2);
    await expect(canvas.getByRole('tab', { name: 'Vilkårsvurdering' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel', { name: 'Vilkårsvurdering' })).toBeVisible();
  },
};

export const BeslutterSenderTilbake: Story = {
  args: {
    ...fakeBeslutterArgsBase,
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('Velg "Vurder på nytt" for Årsak og varsel', async () => {
      const vurderPaNyttRadioer = canvas.getAllByRole('radio', { name: 'Vurder på nytt' });
      await userEvent.click(vurderPaNyttRadioer[0]!);
    });

    await step('Merk årsak "Feil fakta"', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Feil fakta' }));
    });

    await step('Fyll inn begrunnelse for Årsak og varsel', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: 'Begrunnelse' }),
        'Fakta om bosted er ikke riktig vurdert.',
      );
    });

    await step('Godkjenn Vilkårsvurdering', async () => {
      const godkjentRadioer = canvas.getAllByRole('radio', { name: 'Godkjent' });
      await userEvent.click(godkjentRadioer[1]!);
    });

    await step('Send inn skjema', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft/i }));
    });

    await step('Callback er kalt etter innsending', async () => {
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};

export const SaksbehandlerSerBeslutterFanen: Story = {
  args: {
    ...fakeArgsBase,
    innloggetBruker: fakeInnloggetBruker,
    lovligeBehandlingsoperasjoner: fakeLovligeBehandlingsoperasjonerTilGodkjenning,
    totrinnskontrollSkjermlenkeContext: fakeTotrinnskontrollContext,
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR)],
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step }) => {
    await step('Beslutter-fanen er aktiv', async () => {
      await expect(canvas.findByRole('tab', { name: 'Beslutter', selected: true })).resolves.toBeInTheDocument();
    });

    await step('Informasjonsmelding om at saken er sendt til beslutter vises', async () => {
      await expect(canvas.findByText('Saken er sendt til beslutter.')).resolves.toBeInTheDocument();
    });
  },
};

export const ÅrsakOgVarselAvslå: Story = {
  args: {
    ...fakeArgsBase,
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED)],
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('Velg "Avslå en innvilget periode"', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Avslå en innvilget periode' }));
    });

    await step('Fyll inn Fra og med dato', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: 'Fra og med' }), '02.03.2026');
    });

    await step('Fyll inn Til og med dato', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: 'Til og med' }), '30.04.2026');
    });

    await step('Velg årsak', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /årsak/i }),
        BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM,
      );
    });

    await step('Velg kilde til opplysningene', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i }),
        'Register',
      );
    });

    await step('Svar "Nei" — varsel skal ikke sendes', async () => {
      const varsleGroup = findVarselRadiogroup(canvas);
      await userEvent.click(within(varsleGroup).getByRole('radio', { name: 'Nei' }));
    });

    await step('Fyll inn begrunnelse for å ikke varsle', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /begrunnelse for hvorfor det ikke er behov for varsel/i }),
        'Bruker ble varslet på annen måte',
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

export const LokalkontorForeslårVilkår: Story = {
  args: {
    ...fakeArgsBase,
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR)],
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('Vilkårsvurdering-fanen er aktiv', async () => {
      await expect(canvas.findByRole('tab', { name: 'Vilkårsvurdering', selected: true })).resolves.toBeInTheDocument();
    });

    await step('Alert om at inngangsvilkår er ferdig vurdert vises', async () => {
      await expect(
        canvas.findByText(/Alle inngangsvilkår for Nav-kontor er ferdig vurdert/i),
      ).resolves.toBeInTheDocument();
    });

    await step('Klikk "Send til beslutter"', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /send til beslutter/i }));
    });

    await step('Callback er kalt etter sending', async () => {
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};

export const LokalkontorForeslårBostedMedForhåndsvisning: Story = {
  args: {
    ...fakeArgsBase,
    api: apiMedForhåndsvisningsspion,
    behandling: fakeBehandlingMedId,
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR)],
    onAksjonspunktBekreftet: fn(),
  },
  beforeEach: mockWindowOpen,
  play: async ({ canvas, args }) => {
    await canvas.findByRole('button', { name: /send til beslutter/i });
    await userEvent.click(await canvas.findByRole('button', { name: 'Forhåndsvis brev' }));
    await expect(args.api.forhåndsvisVedtaksbrev).toHaveBeenCalledWith(fakeBehandlingMedId.id, 'INNVILGELSE');
  },
};

export const BeslutterKanForhåndsvise: Story = {
  args: {
    ...fakeBeslutterArgsBase,
    behandling: fakeBehandlingMedId,
    vilkår: [fakeBostedVilkårMedHistoriskePerioder],
    onAksjonspunktBekreftet: fn(),
  },
  beforeEach: mockWindowOpen,
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('tab', { name: 'Vilkårsvurdering' }));
    await canvas.findByRole('button', { name: 'Forhåndsvis brev' });
    await expect(canvas.queryByRole('button', { name: /send til beslutter/i })).not.toBeInTheDocument();
  },
};

export const HistoriskBostedsperiodeKanIkkeRedigeres: Story = {
  args: {
    ...fakeArgsBase,
    behandling: fakeBehandlingMedId,
    vilkår: [fakeBostedVilkårMedHistoriskePerioder],
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED)],
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('tab', { name: 'Vilkårsvurdering' }));
    await userEvent.click(await canvas.findByRole('row', { name: /01\.01\.2025/i }));
    await expect(canvas.queryByRole('button', { name: /rediger vurdering/i })).not.toBeInTheDocument();

    await userEvent.click(await canvas.findByRole('row', { name: /01\.01\.2026/i }));
    await canvas.findByRole('button', { name: /rediger vurdering/i });
  },
};

const fakeBistandBehandling = {
  ...fakeBehandling,
  behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.ENDRET_BISTANDSBEHOV }],
} as BehandlingDto;

const fakeBistandVilkår = {
  vilkarType: vilkarType.BISTANDSVILKÅR,
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
} satisfies VilkårMedPerioderDto;

const fakeBistandInnvilgetVilkårsavklaringer = {
  vilkårType: vilkarType.BISTANDSVILKÅR,
  perioder: [{ periode: { fom: '2026-01-29', tom: '2027-01-28' }, utfall: Utfall.OPPFYLT }],
} satisfies VilkårsavklaringerDto;

const fakeBistandApi: AktivitetspengerApi = Object.assign(Object.create(fakeAktivitetspengerApi), {
  hentVilkårsavklaringer: async () => fakeBistandInnvilgetVilkårsavklaringer,
});

const fakeBistandArgsBase = {
  ...fakeArgsBase,
  api: fakeBistandApi,
  behandling: fakeBistandBehandling,
  vilkår: [fakeBistandVilkår],
  aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND)],
  onAksjonspunktBekreftet: fn(),
};

export const Bistand: Story = {
  args: {
    ...fakeBistandArgsBase,
    api: Object.assign(Object.create(fakeBistandApi), {
      bekreftAksjonspunkt: fn(),
    }) as AktivitetspengerApi,
  },
  play: async ({ canvas, canvasElement, step, args }) => {
    await step('Skjemaet viser overskrift og lovreferanse', async () => {
      await expect(canvas.getByText('Ikke lenger behov for bistand')).toBeInTheDocument();
      await expect(canvas.getByRole('link', { name: '6' })).toHaveAttribute('href', expect.stringContaining('§6'));
    });

    await step('Velg den nye perioden som ikke er satt', async () => {
      await userEvent.click(await canvas.findByRole('row', { name: /ikke satt/i }));
    });

    await step('Velg opphør fra en dato', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Opphøre fra en dato' }));
      const opphørsdato = canvas.getByRole('textbox', { name: /opphøre fra og med/i });
      await userEvent.clear(opphørsdato);
      await userEvent.type(opphørsdato, '01.05.2026');
    });

    await step('Årsak er satt til annen årsak og kan ikke endres', async () => {
      await expect(canvas.queryByRole('combobox', { name: /velg årsak/i })).not.toBeInTheDocument();
      await expect(canvas.getByText('Annen årsak')).toBeInTheDocument();
    });

    await step('Velg kilde', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i }),
        'BRUKER',
      );
    });

    await step('Velg å sende varsel, skriv tekst og bekreft forhåndsvarsel', async () => {
      await userEvent.click(within(findVarselRadiogroup(canvas)).getByRole('radio', { name: 'Ja' }));
      await userEvent.type(
        canvas.getByRole('textbox', { name: /tekst i forhåndsvarsel/i }),
        'Bruker har ikke lenger behov for bistand.',
      );
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
      const modal = await within(canvasElement.ownerDocument.body).findByRole('dialog', {
        name: /send forhåndsvarsel/i,
      });
      await userEvent.click(within(modal).getByRole('button', { name: /send forhåndsvarsel/i }));
    });

    await step('Payload sendes til riktig aksjonspunkt', async () => {
      await waitFor(() =>
        expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
          fakeBistandBehandling.uuid,
          fakeBistandBehandling.versjon,
          [
            {
              '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND,
              begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_BISTAND',
              avklaringer: [
                {
                  periode: { fom: '2026-05-01', tom: undefined },
                  avklaring: expect.objectContaining({
                    ikkeOppfyltÅrsak: BistandsvilkårIkkeOppfyltÅrsak.ANNET,
                    kilde: 'BRUKER',
                    skalIkkeSendeVarsel: false,
                    fritekstTilVarsel: 'Bruker har ikke lenger behov for bistand.',
                  }),
                },
              ],
            },
          ],
        ),
      );
    });
  },
};

export const BistandAnnenÅrsakKreverTekstIForhåndsvarsel: Story = {
  args: fakeBistandArgsBase,
  play: async ({ canvas, step }) => {
    await step('Velg den nye perioden som ikke er satt', async () => {
      await userEvent.click(await canvas.findByRole('row', { name: /ikke satt/i }));
    });

    await step('Annen årsak er forhåndsvalgt, og varsel viser tekstfelt for forhåndsvarsel', async () => {
      await expect(canvas.getByText('Annen årsak')).toBeInTheDocument();
      await userEvent.click(within(findVarselRadiogroup(canvas)).getByRole('radio', { name: 'Ja' }));
      await expect(canvas.getByRole('textbox', { name: /tekst i forhåndsvarsel/i })).toBeInTheDocument();
    });
  },
};

const fakeBistandVilkårsavklaringer = {
  vilkårType: vilkarType.BISTANDSVILKÅR,
  perioder: [
    {
      periode: { fom: '2026-01-29', tom: '2026-12-31' },
      utfall: Utfall.IKKE_OPPFYLT,
      avklaring: {
        avklaringtype: Avklaringtype.OPPHØR,
        begrunnelseIkkeVarsel: 'Bruker har selv meldt fra.',
        ikkeOppfyltÅrsak: BistandsvilkårIkkeOppfyltÅrsak.KOMMET_I_UTDANNING,
        kilde: 'ANNET',
        kildeFritekst: 'Melding fra skolen',
        periode: { fom: '2026-01-29', tom: '2026-12-31' },
        referanse: 'bistand-ref',
        skalSendeVarsel: false,
        foreslåttIBehandlingen: true,
        vurdertAv: 'Z123456',
        vurdertTidspunkt: '2026-01-29T10:00:00',
      },
    },
  ],
} satisfies VilkårsavklaringerDto;

export const BistandPreutfylt: Story = {
  args: {
    ...fakeBistandArgsBase,
    behandling: { ...fakeBistandBehandling, uuid: 'fake-bistand-preutfylt-behandling' },
    api: Object.assign(Object.create(fakeAktivitetspengerApi), {
      hentVilkårsavklaringer: fn(async () => fakeBistandVilkårsavklaringer),
    }) as AktivitetspengerApi,
  },
  play: async ({ canvas, step }) => {
    await step('Velg perioden fra avklaringen', async () => {
      await userEvent.click(await canvas.findByRole('row', { name: /29\.01\.2026/i }));
    });

    await step('Vurderte perioder starter i lesevisning og kan redigeres', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: /rediger vurdering/i }));
    });

    await step('Feltene er forhåndsutfylt', async () => {
      await expect(canvas.getByRole('radio', { name: 'Opphøre fra en dato' })).toBeChecked();
      await expect(canvas.getByText('Har startet i utdanning som ikke er et arbeidsmarkedstiltak')).toBeInTheDocument();
      await expect(canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i })).toHaveValue('ANNET');
      await expect(canvas.getByRole('radio', { name: 'Nei' })).toBeChecked();
      await expect(
        canvas.getByRole('textbox', { name: /begrunnelse for hvorfor det ikke er behov for varsel/i }),
      ).toHaveValue('Bruker har selv meldt fra.');
    });
  },
};

const lagFakeBistandVilkårsavklaringVurderinger = (
  ikkeOppfyltÅrsak: BistandsvilkårIkkeOppfyltÅrsak,
): VilkårsavklaringVurderingerDto => ({
  vilkårType: vilkarType.BISTANDSVILKÅR,
  perioder: [
    {
      periode: { fom: '2026-01-29', tom: '2027-01-28' },
      utfall: Utfall.IKKE_VURDERT,
      vurderesIBehandlingen: true,
      avklaringOgVurdering: {
        avklaring: {
          avklaringtype: Avklaringtype.OPPHØR,
          foreslåttIBehandlingen: true,
          ikkeOppfyltÅrsak,
          kilde: 'BRUKER',
          periode: { fom: '2026-01-29', tom: '2027-01-28' },
          referanse: 'bistand-ref',
          skalSendeVarsel: false,
          vurdertAv: 'Z123456',
          vurdertTidspunkt: '2026-01-29T10:00:00',
        },
      },
    },
  ],
});

const lagFakeBistandVilkårsvurderingArgs = (ikkeOppfyltÅrsak: BistandsvilkårIkkeOppfyltÅrsak) => ({
  ...fakeBistandArgsBase,
  aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR_OPPHØR)],
  api: Object.assign(Object.create(fakeAktivitetspengerApi), {
    bekreftAksjonspunkt: fn(),
    hentVilkårsavklaringVurderinger: async () => lagFakeBistandVilkårsavklaringVurderinger(ikkeOppfyltÅrsak),
  }) as AktivitetspengerApi,
  onAksjonspunktBekreftet: fn(),
});

export const BistandVilkårsvurderingOpphørMedFritekst: Story = {
  args: lagFakeBistandVilkårsvurderingArgs(BistandsvilkårIkkeOppfyltÅrsak.KOMMET_I_ARBEID),
  play: async ({ canvas, step, args }) => {
    await step('Vilkårsvurdering-fanen er valgt og viser bistand', async () => {
      await expect(await canvas.findByText('Vurdering av ikke lenger behov for bistand')).toBeInTheDocument();
    });

    await step('Fyll inn begrunnelse og velg opphør', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /vurder om bruker ikke lenger har behov for bistand/i }),
        'Bruker har kommet i fast arbeid.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: /ja, fra og med 29\.01\.2026/i }));
    });

    await step('Fritekst vises først når avkrysningsboksen er valgt', async () => {
      await expect(canvas.queryByRole('textbox', { name: 'Fritekst opphørsbrev' })).not.toBeInTheDocument();
      await userEvent.click(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev'));
      await userEvent.type(
        canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' }),
        'Du har kommet i arbeid og har ikke lenger behov for bistand.',
      );
    });

    await step('Bekreft og fortsett', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
    });

    await step('Payload sendes til riktig aksjonspunkt med fritekst', async () => {
      await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
        fakeBistandBehandling.uuid,
        fakeBistandBehandling.versjon,
        [
          {
            '@type': AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR_OPPHØR,
            begrunnelse: 'Bruker har kommet i fast arbeid.',
            vurdertePerioder: [
              {
                begrunnelse: 'Bruker har kommet i fast arbeid.',
                erVilkårOppfylt: false,
                periode: { fom: '2026-01-29', tom: '2027-01-28' },
                fritekstVurderingBrev: 'Du har kommet i arbeid og har ikke lenger behov for bistand.',
              },
            ],
          },
        ],
      );
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};

export const BistandVilkårsvurderingIkkeOpphør: Story = {
  args: lagFakeBistandVilkårsvurderingArgs(BistandsvilkårIkkeOppfyltÅrsak.KOMMET_I_UTDANNING),
  play: async ({ canvas, step, args }) => {
    await step('Fyll inn begrunnelse og velg nei', async () => {
      await userEvent.type(
        await canvas.findByRole('textbox', { name: /vurder om bruker ikke lenger har behov for bistand/i }),
        'Bruker har fortsatt behov for bistand.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await expect(canvas.queryByLabelText('Legg til fritekstbeskrivelse i avslagsbrev')).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
    });

    await step('Vilkåret sendes som oppfylt uten fritekst', async () => {
      await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
        fakeBistandBehandling.uuid,
        fakeBistandBehandling.versjon,
        [
          expect.objectContaining({
            vurdertePerioder: [expect.objectContaining({ erVilkårOppfylt: true, fritekstVurderingBrev: undefined })],
          }),
        ],
      );
    });
  },
};

export const BistandVilkårsvurderingAnnenÅrsakKreverFritekst: Story = {
  args: lagFakeBistandVilkårsvurderingArgs(BistandsvilkårIkkeOppfyltÅrsak.ANNET),
  play: async ({ canvas, step }) => {
    await step('Velg opphør', async () => {
      await userEvent.click(await canvas.findByRole('radio', { name: /ja, fra og med/i }));
    });

    await step('Fritekst til opphørsbrev vises uten avkrysningsboks', async () => {
      await expect(canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' })).toBeInTheDocument();
      await expect(canvas.queryByLabelText('Legg til fritekstbeskrivelse i avslagsbrev')).not.toBeInTheDocument();
    });
  },
};

const fakeAktivitetBehandling = {
  ...fakeBehandling,
  behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.ENDRET_AKTIVITET }],
} as BehandlingDto;

const fakeAktivitetVilkår = {
  vilkarType: vilkarType.AKTIVITETSVILKÅR,
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
} satisfies VilkårMedPerioderDto;

const fakeAktivitetInnvilgetVilkårsavklaringer = {
  vilkårType: vilkarType.AKTIVITETSVILKÅR,
  perioder: [{ periode: { fom: '2026-01-29', tom: '2027-01-28' }, utfall: Utfall.OPPFYLT }],
} satisfies VilkårsavklaringerDto;

const fakeAktivitetApi: AktivitetspengerApi = Object.assign(Object.create(fakeAktivitetspengerApi), {
  hentVilkårsavklaringer: async () => fakeAktivitetInnvilgetVilkårsavklaringer,
});

const fakeAktivitetArgsBase = {
  ...fakeArgsBase,
  api: fakeAktivitetApi,
  behandling: fakeAktivitetBehandling,
  vilkår: [fakeAktivitetVilkår],
  aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_AKTIVITET)],
  onAksjonspunktBekreftet: fn(),
};

export const Aktivitet: Story = {
  args: {
    ...fakeAktivitetArgsBase,
    api: Object.assign(Object.create(fakeAktivitetApi), {
      bekreftAksjonspunkt: fn(),
    }) as AktivitetspengerApi,
  },
  play: async ({ canvas, canvasElement, step, args }) => {
    await step('Skjemaet viser overskrift og lovreferanse', async () => {
      await expect(canvas.getByText('Ikke i aktivitet')).toBeInTheDocument();
      await expect(canvas.getByRole('link', { name: '8' })).toHaveAttribute('href', expect.stringContaining('§8'));
    });

    await step('Velg den nye perioden som ikke er satt', async () => {
      await userEvent.click(await canvas.findByRole('row', { name: /ikke satt/i }));
    });

    await step('Velg opphør fra en dato', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Opphøre fra en dato' }));
      const opphørsdato = canvas.getByRole('textbox', { name: /opphøre fra og med/i });
      await userEvent.clear(opphørsdato);
      await userEvent.type(opphørsdato, '01.05.2026');
    });

    await step('Velg årsak og kilde', async () => {
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /velg årsak/i }),
        AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET,
      );
      await userEvent.selectOptions(
        canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i }),
        'BRUKER',
      );
    });

    await step('Velg å sende varsel, skriv tekst og bekreft forhåndsvarsel', async () => {
      await userEvent.click(within(findVarselRadiogroup(canvas)).getByRole('radio', { name: 'Ja' }));
      await userEvent.type(
        canvas.getByRole('textbox', { name: /tekst i forhåndsvarsel/i }),
        'Bruker har ikke møtt til planlagte aktiviteter.',
      );
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
      const modal = await within(canvasElement.ownerDocument.body).findByRole('dialog', {
        name: /send forhåndsvarsel/i,
      });
      await userEvent.click(within(modal).getByRole('button', { name: /send forhåndsvarsel/i }));
    });

    await step('Payload sendes til riktig aksjonspunkt', async () => {
      await waitFor(() =>
        expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
          fakeAktivitetBehandling.uuid,
          fakeAktivitetBehandling.versjon,
          [
            {
              '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_AKTIVITET,
              begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_AKTIVITET',
              avklaringer: [
                {
                  periode: { fom: '2026-05-01', tom: undefined },
                  avklaring: expect.objectContaining({
                    ikkeOppfyltÅrsak: AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET,
                    kilde: 'BRUKER',
                    kildeFritekst: undefined,
                    skalIkkeSendeVarsel: false,
                    fritekstTilVarsel: 'Bruker har ikke møtt til planlagte aktiviteter.',
                  }),
                },
              ],
            },
          ],
        ),
      );
    });
  },
};

export const AktivitetKildeOgÅrsakValg: Story = {
  args: fakeAktivitetArgsBase,
  play: async ({ canvas, step }) => {
    await step('Velg den nye perioden som ikke er satt', async () => {
      await userEvent.click(await canvas.findByRole('row', { name: /ikke satt/i }));
    });

    await step('Årsak har bare «Annen årsak», og kilde har bare «Bruker selv» og «Annet»', async () => {
      const årsaker = within(canvas.getByRole('combobox', { name: /velg årsak/i }))
        .getAllByRole('option')
        .map(option => option.textContent)
        .filter(tekst => tekst !== 'Velg');
      await expect(årsaker).toEqual(['Annen årsak']);

      const kilder = within(canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i }))
        .getAllByRole('option')
        .map(option => option.textContent)
        .filter(tekst => tekst !== 'Velg');
      await expect(kilder).toEqual(['Bruker selv', 'Annet']);
    });
  },
};

const fakeAktivitetVilkårsavklaringer = {
  vilkårType: vilkarType.AKTIVITETSVILKÅR,
  perioder: [
    {
      periode: { fom: '2026-01-29', tom: '2026-12-31' },
      utfall: Utfall.IKKE_OPPFYLT,
      avklaring: {
        avklaringtype: Avklaringtype.OPPHØR,
        begrunnelseIkkeVarsel: 'Bruker har selv meldt fra.',
        ikkeOppfyltÅrsak: AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET,
        kilde: 'BRUKER',
        periode: { fom: '2026-01-29', tom: '2026-12-31' },
        referanse: 'aktivitet-ref',
        skalSendeVarsel: false,
        foreslåttIBehandlingen: true,
        vurdertAv: 'Z123456',
        vurdertTidspunkt: '2026-01-29T10:00:00',
      },
    },
  ],
} satisfies VilkårsavklaringerDto;

export const AktivitetPreutfylt: Story = {
  args: {
    ...fakeAktivitetArgsBase,
    behandling: { ...fakeAktivitetBehandling, uuid: 'fake-aktivitet-preutfylt-behandling' },
    api: Object.assign(Object.create(fakeAktivitetspengerApi), {
      hentVilkårsavklaringer: fn(async () => fakeAktivitetVilkårsavklaringer),
    }) as AktivitetspengerApi,
  },
  play: async ({ canvas, step }) => {
    await step('Velg perioden fra avklaringen', async () => {
      await userEvent.click(await canvas.findByRole('row', { name: /29\.01\.2026/i }));
    });

    await step('Vurderte perioder starter i lesevisning og kan redigeres', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: /rediger vurdering/i }));
    });

    await step('Feltene er forhåndsutfylt', async () => {
      await expect(canvas.getByRole('radio', { name: 'Opphøre fra en dato' })).toBeChecked();
      await expect(canvas.getByRole('combobox', { name: /velg årsak/i })).toHaveValue(
        AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET,
      );
      await expect(canvas.getByRole('combobox', { name: /hvor har du fått opplysningene fra/i })).toHaveValue('BRUKER');
      await expect(canvas.getByRole('radio', { name: 'Nei' })).toBeChecked();
      await expect(
        canvas.getByRole('textbox', { name: /begrunnelse for hvorfor det ikke er behov for varsel/i }),
      ).toHaveValue('Bruker har selv meldt fra.');
    });
  },
};

const lagFakeAktivitetVilkårsavklaringVurderinger = (
  ikkeOppfyltÅrsak: AktivitetsvilkåretIkkeOppfyltÅrsak,
  utfall: Utfall = Utfall.IKKE_VURDERT,
): VilkårsavklaringVurderingerDto => ({
  vilkårType: vilkarType.AKTIVITETSVILKÅR,
  perioder: [
    {
      periode: { fom: '2026-01-29', tom: '2027-01-28' },
      utfall,
      vurderesIBehandlingen: true,
      avklaringOgVurdering: {
        avklaring: {
          avklaringtype: Avklaringtype.OPPHØR,
          foreslåttIBehandlingen: true,
          ikkeOppfyltÅrsak,
          kilde: 'BRUKER',
          periode: { fom: '2026-01-29', tom: '2027-01-28' },
          referanse: 'aktivitet-ref',
          skalSendeVarsel: true,
          vurdertAv: 'Z123456',
          vurdertTidspunkt: '2026-01-29T10:00:00',
          uttalelse: {
            harUttalelse: true,
            mottattTidspunkt: '2026-02-10T09:30:00',
            uttalelseTekst: 'Jeg har vært syk og har derfor ikke møtt opp.',
          },
        },
        vurdering:
          utfall === Utfall.IKKE_VURDERT
            ? undefined
            : {
                begrunnelse: 'Bruker har ikke møtt til avtalte aktiviteter.',
                fritekstVurderingBrev: 'Du har ikke deltatt i aktivitetene du har avtalt med Nav.',
                erManuellVurdering: true,
                erVilkårOppfylt: utfall === Utfall.OPPFYLT,
                vurdertAv: 'Z123456',
                vurdertTidspunkt: '2026-02-12T10:00:00',
              },
      },
    },
  ],
});

const lagFakeAktivitetVilkårsvurderingArgs = (
  ikkeOppfyltÅrsak: AktivitetsvilkåretIkkeOppfyltÅrsak,
  {
    status = AksjonspunktStatus.OPPRETTET,
    utfall = Utfall.IKKE_VURDERT,
    kanSaksbehandle = true,
  }: { status?: AksjonspunktDto['status']; utfall?: Utfall; kanSaksbehandle?: boolean } = {},
) => ({
  ...fakeAktivitetArgsBase,
  innloggetBruker: {
    aktivitetspengerDel1SaksbehandlerTilgang: { kanSaksbehandle, kanBeslutte: false },
  } satisfies InnloggetAnsattUngV2Dto,
  aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR_OPPHØR, status)],
  api: Object.assign(Object.create(fakeAktivitetspengerApi), {
    bekreftAksjonspunkt: fn(),
    hentVilkårsavklaringVurderinger: async () => lagFakeAktivitetVilkårsavklaringVurderinger(ikkeOppfyltÅrsak, utfall),
  }) as AktivitetspengerApi,
  onAksjonspunktBekreftet: fn(),
});

export const AktivitetVilkårsvurderingOpphør: Story = {
  args: lagFakeAktivitetVilkårsvurderingArgs(AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET),
  play: async ({ canvas, step, args }) => {
    await step('Vilkårsvurdering-fanen er valgt og viser aktivitet med tilbakemelding fra bruker', async () => {
      await expect(await canvas.findByText('Vurdering av ikke i aktivitet')).toBeInTheDocument();
      await expect(canvas.getByText('Har du en tilbakemelding?')).toBeInTheDocument();
      await expect(canvas.getByText('Svar på forhåndsvarsel')).toBeInTheDocument();
      await expect(canvas.getByText('Jeg har vært syk og har derfor ikke møtt opp.')).toBeInTheDocument();
    });

    await step('Fyll inn begrunnelse og velg opphør', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /vurder om bruker ikke lenger er i aktivitet/i }),
        'Bruker har ikke møtt til avtalte aktiviteter.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: /ja, fra og med 29\.01\.2026/i }));
    });

    await step('Fritekst til opphørsbrev vises uten avkrysningsboks når årsaken er annet', async () => {
      await expect(canvas.queryByLabelText('Legg til fritekstbeskrivelse i avslagsbrev')).not.toBeInTheDocument();
      await userEvent.type(
        canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' }),
        'Du har ikke deltatt i aktivitetene du har avtalt med Nav.',
      );
    });

    await step('Bekreft og fortsett', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
    });

    await step('Payload sendes til riktig aksjonspunkt med fritekst', async () => {
      await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
        fakeAktivitetBehandling.uuid,
        fakeAktivitetBehandling.versjon,
        [
          {
            '@type': AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR_OPPHØR,
            begrunnelse: 'Bruker har ikke møtt til avtalte aktiviteter.',
            vurdertePerioder: [
              {
                begrunnelse: 'Bruker har ikke møtt til avtalte aktiviteter.',
                erVilkårOppfylt: false,
                periode: { fom: '2026-01-29', tom: '2027-01-28' },
                fritekstVurderingBrev: 'Du har ikke deltatt i aktivitetene du har avtalt med Nav.',
              },
            ],
          },
        ],
      );
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};

export const AktivitetVilkårsvurderingIkkeOpphør: Story = {
  args: lagFakeAktivitetVilkårsvurderingArgs(AktivitetsvilkåretIkkeOppfyltÅrsak.AVKORTET),
  play: async ({ canvas, step, args }) => {
    await step('Avkrysningsboks for fritekst vises ved opphør når årsaken ikke er annet', async () => {
      await userEvent.click(await canvas.findByRole('radio', { name: /ja, fra og med/i }));
      await expect(canvas.getByLabelText('Legg til fritekstbeskrivelse i avslagsbrev')).toBeInTheDocument();
      await expect(canvas.queryByRole('textbox', { name: 'Fritekst opphørsbrev' })).not.toBeInTheDocument();
    });

    await step('Fyll inn begrunnelse og velg nei', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /vurder om bruker ikke lenger er i aktivitet/i }),
        'Bruker er fortsatt i aktivitet.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await expect(canvas.queryByLabelText('Legg til fritekstbeskrivelse i avslagsbrev')).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: /bekreft og fortsett/i }));
    });

    await step('Vilkåret sendes som oppfylt uten fritekst', async () => {
      await expect(args.api.bekreftAksjonspunkt).toHaveBeenCalledWith(
        fakeAktivitetBehandling.uuid,
        fakeAktivitetBehandling.versjon,
        [
          expect.objectContaining({
            '@type': AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR_OPPHØR,
            vurdertePerioder: [expect.objectContaining({ erVilkårOppfylt: true, fritekstVurderingBrev: undefined })],
          }),
        ],
      );
    });
  },
};

export const AktivitetVilkårsvurderingÅpentForVeileder: Story = {
  args: lagFakeAktivitetVilkårsvurderingArgs(AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET, { kanSaksbehandle: false }),
  play: async ({ canvas, step }) => {
    await step('Varselet vises, men aksjonspunktet kan ikke løses', async () => {
      await expect(await canvas.findByText('Vurder om bruker ikke lenger er i aktivitet.')).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: /bekreft og fortsett/i })).not.toBeInTheDocument();
    });
  },
};

export const AktivitetVilkårsvurderingRedigerVurdering: Story = {
  args: lagFakeAktivitetVilkårsvurderingArgs(AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET, {
    status: AksjonspunktStatus.UTFØRT,
    utfall: Utfall.IKKE_OPPFYLT,
  }),
  play: async ({ canvas, step }) => {
    await step('Vurderingen vises i lesevisning', async () => {
      await userEvent.click(await canvas.findByRole('tab', { name: 'Vilkårsvurdering' }));
      await expect(await canvas.findByText('Vurdering av ikke i aktivitet')).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: /bekreft og fortsett/i })).not.toBeInTheDocument();
    });

    await step('Rediger vurdering åpner forhåndsutfylt skjema', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /rediger vurdering/i }));
      await expect(canvas.getByRole('textbox', { name: /vurder om bruker ikke lenger er i aktivitet/i })).toHaveValue(
        'Bruker har ikke møtt til avtalte aktiviteter.',
      );
      await expect(canvas.getByRole('radio', { name: /ja, fra og med 29\.01\.2026/i })).toBeChecked();
      await expect(canvas.getByRole('textbox', { name: 'Fritekst opphørsbrev' })).toHaveValue(
        'Du har ikke deltatt i aktivitetene du har avtalt med Nav.',
      );
      await expect(canvas.getByRole('button', { name: /bekreft og fortsett/i })).toBeInTheDocument();
    });

    await step('Avbryt går tilbake til lesevisning', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Avbryt' }));
      await expect(canvas.queryByRole('button', { name: /bekreft og fortsett/i })).not.toBeInTheDocument();
    });
  },
};

export const AktivitetVilkårsvurderingLesevisning: Story = {
  args: lagFakeAktivitetVilkårsvurderingArgs(AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET, {
    status: AksjonspunktStatus.UTFØRT,
    utfall: Utfall.IKKE_OPPFYLT,
    kanSaksbehandle: false,
  }),
  play: async ({ canvas, step }) => {
    await step('Vurderingen vises uten mulighet til å redigere', async () => {
      await userEvent.click(await canvas.findByRole('tab', { name: 'Vilkårsvurdering' }));
      await expect(await canvas.findByText('Vurdering av ikke i aktivitet')).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: /rediger vurdering/i })).not.toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: /bekreft og fortsett/i })).not.toBeInTheDocument();
    });
  },
};
