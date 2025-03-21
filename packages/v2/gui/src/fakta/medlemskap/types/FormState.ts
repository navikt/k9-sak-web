import type { PersonDto } from '@k9-sak-web/backend/k9sak/generated';
import type { Periode } from './Periode';
import type { Soknad } from './Soknad';

interface FixedMedlemskapPerioder {
  fom: string;
  tom: string;
  dekning: string;
  status: string;
  beslutningsdato: string;
}

export interface Foreldre {
  isApplicant: boolean;
  personopplysning: any;
}

export type StatusForBorgerFaktaPanelFormState = {
  erEosBorger: boolean;
  isBorgerAksjonspunktClosed: boolean;
  oppholdsrettVurdering?: boolean;
  lovligOppholdVurdering?: boolean;
  apKode: string;
};

export type OppholdINorgeOgAdresserFaktaPanelFormState = {
  foreldre: Foreldre[];
  bosattVurdering: boolean;
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
  medlemskapManuellVurderingType: string;
};

export type OppholdInntektOgPerioderFormState = {
  soknad: Soknad;
  person: PersonDto;
  gjeldendeFom: string;
  perioder: Periode[];
  oppholdInntektOgPeriodeForm: OppholdInntektOgPeriodeFormState;
};
