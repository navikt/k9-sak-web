import {
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonPeriodeDto,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat,
} from '@k9-sak-web/backend/k9sak/generated';
import type { Period } from '@navikt/ft-utils';

export interface InstitusjonPerioderDtoMedResultat
  extends k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonPeriodeDto {
  perioder: Period[];
  resultat: k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat;
}
