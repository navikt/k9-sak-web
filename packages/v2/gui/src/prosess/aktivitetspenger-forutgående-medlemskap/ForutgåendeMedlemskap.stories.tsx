import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { MedlemskapAvslagsÅrsakType } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapAvslagsÅrsakType.js';
import {
  FakeAktivitetspengerApi,
  fakeAktivitetspengerApi,
} from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { SaksbehandlernavnContext } from '@k9-sak-web/gui/shared/SaksbehandlernavnContext/SaksbehandlernavnContext.js';
import { ForutgåendeMedlemskap } from './ForutgåendeMedlemskap';
import type { MedlemskapPeriodeInfoMedFritekstDto } from './midlertidigeTyper.js';

const fakeBehandling = {
  uuid: 'fake-uuid',
  versjon: 1,
} as unknown as BehandlingDto;

// Vilkårsperioden (`periode`) er fremover i tid, mens `forutgåendePeriode` og utenlandsoppholdene i
// `medlemskapFraBruker` ligger bakover i tid — de overlapper bevisst ikke i disse eksemplene for å
// synliggjøre at det er to ulike tidslinjer.
const lagPeriodeInfo = (
  periode: { fom: string; tom: string },
  utfall: Utfall,
  land: string,
  landkode: string,
  forutgåendePeriode: { fom: string; tom: string },
  harJobbetUtenforNorge: boolean | undefined = false,
  utenlandskNasjonalId: string | undefined = undefined,
  harTrygdeavtale = true,
  erManueltVurdert = utfall !== Utfall.IKKE_VURDERT,
  vurderesIBehandlingen = utfall === Utfall.IKKE_VURDERT,
): MedlemskapPeriodeInfoMedFritekstDto => ({
  periode,
  utfall,
  avslagsårsak: utfall === Utfall.IKKE_OPPFYLT ? MedlemskapAvslagsÅrsakType.SØKER_IKKE_MEDLEM : undefined,
  begrunnelse:
    utfall === Utfall.IKKE_VURDERT
      ? undefined
      : `Forutgående medlemskap er ${utfall === Utfall.OPPFYLT ? '' : 'ikke '}godkjent.`,
  fritekstVurderingBrev:
    utfall === Utfall.IKKE_OPPFYLT
      ? 'Du har ikke vært medlem i folketrygden de siste fem årene før du søkte om aktivitetspenger.'
      : undefined,
  vurderesIBehandlingen,
  erManueltVurdert,
  medlemskapFraBruker: {
    forutgåendePeriode,
    harBoddINorge: true,
    harJobbetINorge: true,
    harJobbetUtenforNorge,
    journalpostId: '123456789',
    utenlandsopphold: [
      {
        land,
        landkode,
        periode: forutgåendePeriode,
        harJobbetIPerioden: false,
        utenlandskNasjonalId,
        harTrygdeavtale,
      },
    ],
  },
});

const periode1 = { fom: '2022-01-01', tom: '2022-12-31' };
const periode2 = { fom: '2023-01-01', tom: '2023-06-30' };
const forutgåendePeriode1 = { fom: '2018-03-01', tom: '2019-08-31' };
const forutgåendePeriode2 = { fom: '2020-01-01', tom: '2021-06-30' };

const meta = {
  title: 'gui/prosess/aktivitetspenger-forutgående-medlemskap/ForutgåendeMedlemskap',
  component: ForutgåendeMedlemskap,
  args: {
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: () => {},
    aksjonspunkt: { definisjon: AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP },
    readOnly: false,
    perioder: [
      lagPeriodeInfo(periode1, Utfall.IKKE_VURDERT, 'Sverige', 'SWE', forutgåendePeriode1, false, '198501011234', true),
      lagPeriodeInfo(periode2, Utfall.IKKE_VURDERT, 'USA', 'USA', forutgåendePeriode2, undefined, undefined, false),
    ],
    isPermanentlyReadOnly: false,
  },
} satisfies Meta<typeof ForutgåendeMedlemskap>;
export default meta;

type Story = StoryObj<typeof meta>;

export const IkkeVurdert: Story = {};

export const DelvisVurdert: Story = {
  args: {
    perioder: [
      lagPeriodeInfo(periode1, Utfall.OPPFYLT, 'Sverige', 'SWE', forutgåendePeriode1),
      lagPeriodeInfo(periode2, Utfall.IKKE_VURDERT, 'USA', 'USA', forutgåendePeriode2),
    ],
  },
};

export const AlleOppfylt: Story = {
  args: {
    perioder: [
      lagPeriodeInfo(periode1, Utfall.OPPFYLT, 'Sverige', 'SWE', forutgåendePeriode1),
      lagPeriodeInfo(periode2, Utfall.OPPFYLT, 'USA', 'USA', forutgåendePeriode2),
    ],
  },
};

export const MedAvslag: Story = {
  args: {
    perioder: [
      lagPeriodeInfo(periode1, Utfall.OPPFYLT, 'Sverige', 'SWE', forutgåendePeriode1),
      lagPeriodeInfo(periode2, Utfall.IKKE_OPPFYLT, 'USA', 'USA', forutgåendePeriode2),
    ],
  },
};

export const AutomatiskVurdert: Story = {
  args: {
    perioder: [
      lagPeriodeInfo(periode1, Utfall.OPPFYLT, 'Sverige', 'SWE', forutgåendePeriode1, false, undefined, true, false),
      lagPeriodeInfo(periode2, Utfall.IKKE_VURDERT, 'USA', 'USA', forutgåendePeriode2),
    ],
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    perioder: [
      lagPeriodeInfo(periode1, Utfall.OPPFYLT, 'Sverige', 'SWE', forutgåendePeriode1),
      lagPeriodeInfo(periode2, Utfall.IKKE_OPPFYLT, 'USA', 'USA', forutgåendePeriode2),
    ],
  },
};

const manueltVurdertIDenneBehandlingen = [
  lagPeriodeInfo(
    periode1,
    Utfall.OPPFYLT,
    'Sverige',
    'SWE',
    forutgåendePeriode1,
    false,
    '198501011234',
    true,
    true,
    true,
  ),
];

export const ManueltVurdertMedNavn: Story = {
  args: {
    aksjonspunkt: {
      definisjon: AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP,
      status: AksjonspunktStatus.UTFØRT,
      ansvarligSaksbehandler: 'Z12345',
    },
    perioder: manueltVurdertIDenneBehandlingen,
  },
  decorators: [
    Story => (
      <SaksbehandlernavnContext.Provider value={{ Z12345: 'Sara Saksbehandler' }}>
        <Story />
      </SaksbehandlernavnContext.Provider>
    ),
  ],
};

export const ManueltVurdertUtenNavn: Story = {
  args: {
    aksjonspunkt: { definisjon: AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP, status: AksjonspunktStatus.UTFØRT },
    perioder: manueltVurdertIDenneBehandlingen,
  },
};

const bekreftAksjonspunktSpy = fn();

class FakeAktivitetspengerApiMedSpy extends FakeAktivitetspengerApi {
  override async bekreftAksjonspunkt(...args: unknown[]) {
    bekreftAksjonspunktSpy(...args);
    return undefined;
  }
}

export const MedAvslagLesevisning: Story = {
  args: {
    aksjonspunkt: { definisjon: AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP, status: AksjonspunktStatus.UTFØRT },
    perioder: [
      lagPeriodeInfo(
        periode1,
        Utfall.IKKE_OPPFYLT,
        'USA',
        'USA',
        forutgåendePeriode1,
        false,
        undefined,
        false,
        true,
        true,
      ),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Fritekst avslagsbrev')).toBeInTheDocument();
    await expect(
      canvas.getByText('Du har ikke vært medlem i folketrygden de siste fem årene før du søkte om aktivitetspenger.'),
    ).toBeInTheDocument();
  },
};

export const FritekstVedAvslag: Story = {
  args: {
    api: new FakeAktivitetspengerApiMedSpy(),
    onAksjonspunktBekreftet: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    bekreftAksjonspunktSpy.mockClear();

    await step('fritekstfelt vises ikke før Nei er valgt', async () => {
      await expect(canvas.queryByLabelText(/Fritekst avslagsbrev/)).not.toBeInTheDocument();
    });

    await step('fritekstfelt er påkrevd når Nei er valgt', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /Vurder om søker har forutgående medlemskap/ }),
        'Begrunnelse',
      );
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await expect(canvas.getByRole('textbox', { name: /Fritekst avslagsbrev/ })).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await expect((await canvas.findAllByText('Feltet må fylles ut')).length).toBeGreaterThan(0);
      await expect(bekreftAksjonspunktSpy).not.toHaveBeenCalled();
    });

    await step('sender fritekstVurderingBrev ved innsending', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: /Fritekst avslagsbrev/ }), 'Tekst til vedtaksbrevet');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await expect(bekreftAksjonspunktSpy).toHaveBeenCalledWith('fake-uuid', 1, [
        expect.objectContaining({
          erVilkårInnvilget: false,
          fritekstVurderingBrev: 'Tekst til vedtaksbrevet',
        }),
      ]);
      await expect(args.onAksjonspunktBekreftet).toHaveBeenCalled();
    });
  },
};
