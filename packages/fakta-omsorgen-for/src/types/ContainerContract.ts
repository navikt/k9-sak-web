import { fagsakYtelseType } from '@k9-sak-web/backend/k9sak/generated';

export interface ContainerContract {
  endpoints: {
    omsorgsperioder: string;
  };
  readOnly: boolean;
  onFinished: (vurdering, fosterbarnForOmsorgspenger) => void;
  httpErrorHandler: (statusCode: number, locationHeader?: string) => void;
  sakstype?: fagsakYtelseType;
}
