import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Aksjonspunkt } from '@k9-sak-web/types';

export interface ContainerContract {
  omsorgenForAksjonspunkt?: Aksjonspunkt;
  endpoints: {
    omsorgsperioder: string;
  };
  readOnly: boolean;
  onFinished: (vurdering, fosterbarnForOmsorgspenger) => void;
  errorNotifier: (error: Error) => void;
  sakstype?: FagsakYtelsesType;
}
