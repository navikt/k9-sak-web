import AnnenPart from '../constants/AnnenPart';
import Utfall from '../constants/Utfall';
import Årsaker from '../constants/Årsaker';
import Endringsstatus from './Endringsstatus';
import GraderingMotTilsyn from './GraderingMotTilsyn';
import Inngangsvilkår from './Inngangsvilkår';
import Period from './Period';
import Utbetalingsgrad from './Utbetalingsgrad';

export interface Uttaksperiodeelement {
  utfall: Utfall;
  uttaksgrad: number;
  søkerBerOmMaksimalt?: number;
  årsaker: Årsaker[];
  inngangsvilkår: Inngangsvilkår;
  kildeBehandlingUUID: string;
  knekkpunktTyper: string[];
  manueltOverstyrt: boolean;
  utbetalingsgrader: Utbetalingsgrad[];
  graderingMotTilsyn: GraderingMotTilsyn;
  annenPart: AnnenPart;
  søkersTapteArbeidstid: number;
  pleiebehov: number;
  endringsstatus?: Endringsstatus;
  utenlandsoppholdUtenÅrsak?: boolean;
  utenlandsopphold?: {
    ErEøsLand: boolean;
    landkode: string;
    årsak: string;
  };
}

export interface Uttaksperiode extends Uttaksperiodeelement {
  periode: Period;
  harOppholdTilNestePeriode?: boolean;
}
