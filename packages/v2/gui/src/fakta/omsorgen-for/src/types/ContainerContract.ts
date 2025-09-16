import { type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

export interface ContainerContract {
  endpoints: {
    omsorgsperioder: string;
  };
  readOnly: boolean;
  onFinished: (vurdering, fosterbarnForOmsorgspenger) => void;
  httpErrorHandler: (statusCode: number, locationHeader?: string) => void;
  sakstype?: FagsakYtelsesType;
}
