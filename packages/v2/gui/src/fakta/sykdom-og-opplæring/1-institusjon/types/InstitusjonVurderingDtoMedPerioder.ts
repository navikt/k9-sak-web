import type { InstitusjonVurderingDto } from '@k9-sak-web/backend/k9sak/tjenester/behandling/opplæringspenger/visning/institusjon/InstitusjonVurderingDto.js';
import type { Period } from '@navikt/ft-utils';

export interface InstitusjonVurderingDtoMedPerioder extends InstitusjonVurderingDto {
  perioder: Period[];
  institusjon: string;
}
