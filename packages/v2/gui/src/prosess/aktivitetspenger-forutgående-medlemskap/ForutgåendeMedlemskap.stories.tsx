import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { MedlemskapAvslagsÅrsakType } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapAvslagsÅrsakType.js';
import type { MedlemskapPeriodeInfoDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapPeriodeInfoDto.js';
import { fakeAktivitetspengerApi } from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ForutgåendeMedlemskap } from './ForutgåendeMedlemskap';

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
  harJobbetUtenforNorge: boolean | null = false,
  utenlandskNasjonalId: string | null = null,
  harTrygdeavtale = true,
  erManueltVurdert = utfall !== Utfall.IKKE_VURDERT,
): MedlemskapPeriodeInfoDto => ({
  periode,
  utfall,
  avslagsårsak: utfall === Utfall.IKKE_OPPFYLT ? MedlemskapAvslagsÅrsakType.SØKER_IKKE_MEDLEM : null,
  begrunnelse:
    utfall === Utfall.IKKE_VURDERT
      ? null
      : `Forutgående medlemskap er ${utfall === Utfall.OPPFYLT ? '' : 'ikke '}godkjent.`,
  vurderesIBehandlingen: utfall === Utfall.IKKE_VURDERT,
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
      lagPeriodeInfo(periode2, Utfall.IKKE_VURDERT, 'USA', 'USA', forutgåendePeriode2, null, null, false),
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
      lagPeriodeInfo(periode1, Utfall.OPPFYLT, 'Sverige', 'SWE', forutgåendePeriode1, false, null, true, false),
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
