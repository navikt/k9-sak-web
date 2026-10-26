/* eslint-disable storybook/prefer-pascal-case */
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingÅrsakType.js';
import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avklaringtype.js';
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
import { expect, fn, spyOn, userEvent, within } from 'storybook/test';
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
  perioder: [{ periode: { fom: '2026-01-29', tom: '2027-01-28' }, utfall: Utfall.IKKE_VURDERT }],
} satisfies VilkårsavklaringerDto;

const lagFakeBostedVilkårsavklaringVurderinger = (
  ikkeOppfyltÅrsak: BostedsvilkårIkkeOppfyltÅrsak,
): VilkårsavklaringVurderingerDto => ({
  vilkårType: vilkarType.BOSTEDSVILKÅR,
  perioder: [
    {
      periode: { fom: '2026-01-29', tom: '2027-01-28' },
      utfall: Utfall.IKKE_VURDERT,
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
  api: fakeAktivitetspengerApi,
  behandling: fakeAndreLivsoppholdytelserBehandling,
  vilkår: [fakeAndreLivsoppholdytelserVilkår],
  aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER)],
  onAksjonspunktBekreftet: fn(),
};

export const AndreLivsoppholdytelser: Story = {
  args: fakeAndreLivsoppholdytelserArgsBase,
  play: async ({ canvas, step }) => {
    await step('Velg perioden som skal vurderes', async () => {
      await userEvent.click(canvas.getByRole('row', { name: /29\.01\.2026 - 28\.01\.2027/i }));
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
      await userEvent.click(canvas.getByRole('row', { name: /29\.01\.2026 - 31\.12\.2026/i }));
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
    api: Object.assign(Object.create(fakeAktivitetspengerApi), {
      bekreftAksjonspunkt: fn(),
    }) as AktivitetspengerApi,
  },
  play: async ({ canvas, canvasElement, step, args }) => {
    await step('Velg perioden som skal vurderes', async () => {
      await userEvent.click(canvas.getByRole('row', { name: /29\.01\.2026 - 28\.01\.2027/i }));
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
