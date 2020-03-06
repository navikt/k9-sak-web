import { ReactNode } from 'react';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

interface FaktaPanelDefinisjon {
  urlCode: string;
  textCode: string;
  aksjonspunkterCodes: string[];
  endpoints: EndpointOperations[];
  renderComponent: (props: any) => ReactNode;
  showComponent: (data?: any) => true | false;
  getData: (data?: any) => {};
}

export default FaktaPanelDefinisjon;
