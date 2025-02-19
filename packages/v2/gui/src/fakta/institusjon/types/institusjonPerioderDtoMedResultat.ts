import { type InstitusjonPeriodeDto, type InstitusjonVurderingDtoResultat } from '@navikt/k9-sak-typescript-client';
import { Period } from '@fpsak-frontend/utils';

export interface InstitusjonPerioderDtoMedResultat extends InstitusjonPeriodeDto {
  perioder: Period[];
  resultat: InstitusjonVurderingDtoResultat;
}
