import type { InstitusjonPeriodeDto } from '@k9-sak-web/backend/k9sak/tjenester/behandling/opplæringspenger/visning/institusjon/InstitusjonPeriodeDto.js';
import type { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/tjenester/behandling/opplæringspenger/visning/institusjon/InstitusjonVurderingDtoResultat.js';
import type { Period } from '@navikt/ft-utils';

export interface InstitusjonPerioderDtoMedResultat
  extends InstitusjonPeriodeDto {
  perioder: Period[];
  resultat: InstitusjonVurderingDtoResultat;
}
