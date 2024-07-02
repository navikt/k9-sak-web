import { FagsakPerson, Kodeverk } from '@k9-sak-web/types';
import { Periode } from './Periode';
import { Soknad } from './Soknad';

interface FixedMedlemskapPerioder {
  fom: string;
  tom: string;
  dekning: string;
  status: string;
  beslutningsdato: string;
}

interface Foreldre {
  isApplicant: any;
  personopplysning: any;
}

export type StatusForBorgerFaktaPanelFormState = {
  erEosBorger: boolean;
  isBorgerAksjonspunktClosed: boolean;
  oppholdsrettVurdering: boolean;
  lovligOppholdVurdering: boolean;
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
    // medlemskapPerioder: Periode[];
    begrunnelse: string;
  };

export type PerioderMedMedlemskapFaktaPanelFormState = {
  fixedMedlemskapPerioder?: FixedMedlemskapPerioder[];
  hasPeriodeAksjonspunkt?: boolean;
  isPeriodAksjonspunktClosed?: boolean;
  medlemskapManuellVurderingType: Kodeverk;
};

export type OppholdInntektOgPerioderFormState = {
  soknad: Soknad;
  person: FagsakPerson;
  gjeldendeFom: string;
  perioder: Periode[];
  // begrunnelse: string;
  // vurderingTypes: KodeverkMedNavn[];
  oppholdInntektOgPeriodeForm: OppholdInntektOgPeriodeFormState;
};
