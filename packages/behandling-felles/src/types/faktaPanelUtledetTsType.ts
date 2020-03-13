import { ReactNode } from 'react';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { Aksjonspunkt, Kodeverk } from '@k9-sak-web/types';
import Behandling from '@k9-sak-web/types/src/behandlingTsType';

interface FaktaPanelUtledet {
  urlCode: string;
  textCode: string;
  endpoints: EndpointOperations[];
  renderComponent: (props: {
    behandling: Behandling;
    submitCallback: (aksjonspunktValues: any[]) => void;
    alleKodeverk: { [key: string]: Kodeverk[] };
    [key: string]: any;
  }) => ReactNode;
  harApneAksjonspunkter: boolean;
  komponentData: {
    aksjonspunkter: Aksjonspunkt[];
    readOnly: boolean;
    submittable: boolean;
    harApneAksjonspunkter: boolean;
    alleMerknaderFraBeslutter: {};
  };
}

export default FaktaPanelUtledet;
