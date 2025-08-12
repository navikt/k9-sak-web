import type { sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonVurderingDto as InstitusjonVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import type { Period } from '@navikt/ft-utils';

export interface InstitusjonVurderingDtoMedPerioder extends InstitusjonVurderingDto {
  perioder: Period[];
  institusjon: string;
}
