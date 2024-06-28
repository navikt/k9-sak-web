import { FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
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

type OppholdINorgeOgAdresserFaktaPanelFormState = {
  foreldre: Foreldre[];
};

export type OppholdInntektOgPeriodeFormState = Periode &
  StatusForBorgerFaktaPanelFormState &
  OppholdINorgeOgAdresserFaktaPanelFormState &
  PerioderMedMedlemskapFaktaPanelFormState & {
    medlemskapPerioder: Periode[];
    begrunnelse: string;
  };

type PerioderMedMedlemskapFaktaPanelFormState = {
  fixedMedlemskapPerioder?: FixedMedlemskapPerioder[];
  hasPeriodeAksjonspunkt?: boolean;
  isPeriodAksjonspunktClosed?: boolean;
};

export type OppholdInntektOgPerioderFormState = {
  soknad: Soknad;
  person: FagsakPerson;
  gjeldendeFom: string;
  perioder: Periode[];
  begrunnelse: string;
  vurderingTypes: KodeverkMedNavn[];
  oppholdInntektOgPeriodeForm: OppholdInntektOgPeriodeFormState;
};
