import Period from './Period';
import Utbetalingsgrad from './Utbetalingsgrad';
import GraderingMotTilsyn from './GraderingMotTilsyn';
import Utfall from '../constants/Utfall';
import Inngangsvilkår from './Inngangsvilkår';
import AnnenPart from '../constants/AnnenPart';
import Årsaker from '../constants/Årsaker';
import Endringsstatus from './Endringsstatus';

export interface Uttaksperiodeelement {
  utfall: Utfall;
  uttaksgrad: number;
  søkerBerOmMaksimalt?: number;
  årsaker: Årsaker[];
  inngangsvilkår: Inngangsvilkår;
  kildeBehandlingUUID: string;
  knekkpunktTyper: string[];
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
}
