import { Period } from '@fpsak-frontend/utils';
import { RequestPayload } from '../types/RequestPayload';
import { Vurderingsversjon } from '../types/Vurdering';
import Vurderingstype from '../types/Vurderingstype';

type HttpErrorHandler = (statusCode: number, locationHeader?: string) => void;

type VurderingsversjonMedType = Partial<Vurderingsversjon> & {
  type: Vurderingstype;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

interface InnleggelsesperioderRequestBody extends RequestPayload {
  perioder: Period[];
}

export interface InnleggelsesperiodeDryRunResponse {
  førerTilRevurdering?: boolean;
}
