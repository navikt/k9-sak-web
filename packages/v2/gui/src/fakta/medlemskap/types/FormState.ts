import type { k9_sak_kontrakt_person_PersonDto as PersonDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Periode } from './Periode';
import type { Personopplysninger } from './Personopplysninger';
import type { Søknad } from './Søknad';

interface FixedMedlemskapPerioder {
  fom: string;
  tom: string;
  dekning: string;
  status: string;
  beslutningsdato: string | null;
}

export interface Foreldre {
  isApplicant: boolean;
  personopplysning: Personopplysninger;
}

export type StatusForBorgerFaktaPanelFormState = {
  erEosBorger?: boolean;
  isBorgerAksjonspunktClosed?: boolean;
  oppholdsrettVurdering?: boolean;
  lovligOppholdVurdering?: boolean;
  apKode?: string;
};

export type OppholdINorgeOgAdresserFaktaPanelFormState = {
  foreldre: Foreldre[];
  bosattVurdering?: boolean;
  hasBosattAksjonspunkt: boolean;
  isBosattAksjonspunktClosed: boolean;
  opphold: { utlandsopphold?: any[] };
};

export type OppholdInntektOgPeriodeFormState = Periode &
  StatusForBorgerFaktaPanelFormState &
  OppholdINorgeOgAdresserFaktaPanelFormState &
  PerioderMedMedlemskapFaktaPanelFormState & {
    begrunnelse: string;
  };

export type PerioderMedMedlemskapFaktaPanelFormState = {
  fixedMedlemskapPerioder?: FixedMedlemskapPerioder[];
  hasPeriodeAksjonspunkt?: boolean;
  isPeriodAksjonspunktClosed?: boolean;
  medlemskapManuellVurderingType?: string;
};

export type OppholdInntektOgPerioderFormState = {
  soknad: Søknad;
  person: PersonDto;
  gjeldendeFom: string;
  perioder: Periode[];
  oppholdInntektOgPeriodeForm: OppholdInntektOgPeriodeFormState;
};
