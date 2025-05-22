import { Kilde, Periode } from '@k9-sak-web/types';
import AnnenPart from '../constants/AnnenPart';
import Utfall from '../constants/Utfall';
import Årsaker from '../constants/Årsaker';
import Endringsstatus from './Endringsstatus';
import GraderingMotTilsyn from './GraderingMotTilsyn';
import Period from './Period';
import Utbetalingsgrad from './Utbetalingsgrad';
import { VilkårMedPerioderDtoVilkarType, VilkårPeriodeDtoVilkarStatus } from '@k9-sak-web/backend/k9sak/generated';

export enum Vurderingsresultat {
  OPPFYLT = 'OPPFYLT',
  IKKE_OPPFYLT = 'IKKE_OPPFYLT',
  IKKE_VURDERT = 'IKKE_VURDERT',
}

export interface Uttaksperiodeelement {
  utfall: Utfall;
  uttaksgrad: number;
  uttaksgradMedReduksjonGrunnetInntektsgradering?: number;
  uttaksgradUtenReduksjonGrunnetInntektsgradering?: number;
  søkerBerOmMaksimalt?: number;
  årsaker: Årsaker[];
  inngangsvilkår: Partial<Record<VilkårMedPerioderDtoVilkarType, VilkårPeriodeDtoVilkarStatus>>;
  kildeBehandlingUUID: string;
  knekkpunktTyper: string[];
  manueltOverstyrt: boolean;
  utbetalingsgrader: Utbetalingsgrad[];
  graderingMotTilsyn: GraderingMotTilsyn;
  annenPart: AnnenPart;
  nattevåk?: UttaksperiodeBeskrivelserMedVurderinger;
  beredskap?: UttaksperiodeBeskrivelserMedVurderinger;
  søkersTapteArbeidstid: number;
  oppgittTilsyn?: string;
  pleiebehov: number;
  endringsstatus?: Endringsstatus;
  utenlandsoppholdUtenÅrsak?: boolean;
  utenlandsopphold?: {
    ErEøsLand: boolean;
    landkode: string;
    årsak: string;
  };
  søkersTapteTimer?: string;
}

export interface UttaksperiodeBeskrivelserMedVurderinger {
  beskrivelser: {
    periode: Periode;
    tekst: string;
    mottattDato: string;
    kilde: Kilde;
  };
  vurderinger: {
    id: number;
    periode: Periode;
    begrunnelse: string;
    resultat: Vurderingsresultat;
    kilde: Kilde;
  };
}

export interface Uttaksperiode extends Uttaksperiodeelement {
  periode: Period;
  harOppholdTilNestePeriode?: boolean;
}

export interface Inntektsforhold {
  arbeidsgiverIdentifikator: string;
  arbeidstidprosent: number;
  løpendeInntekt: number;
  bruttoInntekt: number;
  erNytt: boolean;
  type: string;
}
export interface Inntektsgradering {
  periode: Periode;
  inntektsforhold: Inntektsforhold[];
  beregningsgrunnlag: number;
  løpendeInntekt: number;
  bortfaltInntekt: number;
  reduksjonsProsent: number;
  graderingsProsent: number;
}

export interface UttaksperiodeMedInntektsgradering extends Uttaksperiode {
  inntektsgradering?: Inntektsgradering | undefined;
}
