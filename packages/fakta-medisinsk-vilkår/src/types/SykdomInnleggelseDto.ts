import { Period } from '@fpsak-frontend/utils';
import { RequestPayload } from './RequestPayload';

export interface SykdomInnleggelseEndringDto {
  fraPeriode: Period | null;
  tilPeriode: Period | null;
  begrunnelse: string;
}

export interface SykdomInnleggelseDto extends RequestPayload {
  perioder: Period[];
  endringer?: SykdomInnleggelseEndringDto[];
}
