import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonVurderingDto as InstitusjonVurderingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Period } from '@k9-sak-web/gui/utils/Period.js';

export interface InstitusjonVurderingDtoMedPerioder extends InstitusjonVurderingDto {
  perioder: Period[];
  institusjon: string;
}
