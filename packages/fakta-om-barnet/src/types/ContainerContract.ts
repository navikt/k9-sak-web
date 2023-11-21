import { HttpErrorHandler } from '@navikt/k9-fe-http-utils';

interface ContainerContract {
  readOnly: boolean;
  endpoints: {
    rettVedDod: string;
    omPleietrengende: string;
  };
  httpErrorHandler: HttpErrorHandler;
  onFinished: (vurdering) => void;
}

export default ContainerContract;
