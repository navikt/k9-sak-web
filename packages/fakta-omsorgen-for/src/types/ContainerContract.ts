import { HttpErrorHandler } from '@navikt/k9-fe-http-utils';

export interface ContainerContract {
  endpoints: {
    omsorgsperioder: string;
  };
  readOnly: boolean;
  onFinished: (vurdering, fosterbarnForOmsorgspenger) => void;
  httpErrorHandler: HttpErrorHandler;
  sakstype?: string;
  saksbehandlere: { [key: string]: string };
}
