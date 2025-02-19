import { type InstitusjonPeriodeDto, type InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import { Period } from '@fpsak-frontend/utils';

export interface InstitusjonPerioderDtoMedResultat extends InstitusjonPeriodeDto {
  perioder: Period[];
  resultat: InstitusjonVurderingDtoResultat;
}
