import type { InstitusjonVurderingDto } from '@navikt/k9-sak-typescript-client';
import type { Period } from '@navikt/ft-utils';

export interface InstitusjonVurderingDtoMedPerioder extends InstitusjonVurderingDto {
  perioder: Period[];
  institusjon: string;
}
