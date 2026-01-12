import { findEndpointsFromRels, httpErrorHandler as httpErrorHandlerFn } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import type { Aksjonspunkt as AksjonspunktType } from '@k9-sak-web/types';
import type { BehandlingAppKontekst } from '@k9-sak-web/types';
import InntektsmeldingContainer from './src/ui/InntektsmeldingContainer';
import type { ArbeidsgiverOpplysninger, DokumentOpplysninger } from './src/types/ContainerContract';
import type AksjonspunktRequestPayload from './src/types/AksjonspunktRequestPayload';

interface InntektsmeldingProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  arbeidsgiverOpplysningerPerId: Record<string, ArbeidsgiverOpplysninger>;
  dokumenter?: DokumentOpplysninger[];
  aksjonspunkter: AksjonspunktType[];
  submitCallback: (aksjonspunkter: AksjonspunktRequestPayload[]) => void;
}

const Inntektsmelding = ({
  behandling,
  readOnly,
  arbeidsgiverOpplysningerPerId,
  dokumenter,
  aksjonspunkter,
  submitCallback,
}: InntektsmeldingProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandlerFn(status, addErrorMessage, locationHeader);

  const løsAksjonspunkt = (aksjonspunktArgs: AksjonspunktRequestPayload) =>
    submitCallback([{ ...aksjonspunktArgs }]);

  return (
    <InntektsmeldingContainer
      data={{
        httpErrorHandler: httpErrorHandlerCaller,
        arbeidsforhold: arbeidsgiverOpplysningerPerId,
        dokumenter,
        readOnly,
        onFinished: løsAksjonspunkt,
        endpoints: findEndpointsFromRels(behandling.links, [
          { rel: 'kompletthet-beregning', desiredName: 'kompletthetBeregning' },
        ]),
        aksjonspunkter,
      }}
    />
  );
};

export default Inntektsmelding;
