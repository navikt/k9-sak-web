import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsFromRels, httpErrorHandler } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';

interface LangvarigSyk {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse }]: {
    kode: string;
    begrunnelse: string;
  }[]) => void;
}

export default ({
                  behandling: { links },
                  readOnly,
                  aksjonspunkter,
                  submitCallback
}: LangvarigSyk) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const langvarigSykAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_LANGVARIG_SYK);
  const langvarigSykAksjonspunktkode = langvarigSykAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!langvarigSykAksjonspunktkode;

  const løsAksjonspunkt = ({ begrunnelse }) =>
    submitCallback([{ kode: langvarigSykAksjonspunktkode, begrunnelse: begrunnelse }]);

  return (
    // TODO: Lag fakta-panel
    <p>Work in progress...</p>
  );
};
