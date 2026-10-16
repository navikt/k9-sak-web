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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
