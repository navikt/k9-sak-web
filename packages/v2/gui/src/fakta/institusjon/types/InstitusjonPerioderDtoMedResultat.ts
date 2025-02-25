import { type InstitusjonPeriodeDto, type InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import type { Period } from '@navikt/ft-utils';

export interface InstitusjonPerioderDtoMedResultat extends InstitusjonPeriodeDto {
  perioder: Period[];
  resultat: InstitusjonVurderingDtoResultat;
}
