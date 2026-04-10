import {
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonPeriodeDto,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Period } from '@k9-sak-web/gui/utils/Period.js';

export interface InstitusjonPerioderDtoMedResultat extends k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonPeriodeDto {
  perioder: Period[];
  resultat: k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat;
}
