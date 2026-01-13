import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingAppKontekst } from '@k9-sak-web/types';
import { Suspense, useMemo, type ReactElement } from 'react';
import InntektsmeldingContext from '../context/InntektsmeldingContext';
import type {
  ArbeidsgiverOpplysninger,
  DokumentOpplysninger,
  InntektsmeldingContextType,
  InntektsmeldingRequestPayload,
} from '../types';
import InntektsmeldingContainer from './components/InntektsmeldingContainer';

export interface InntektsmeldingContainerProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  arbeidsgiverOpplysningerPerId: Record<string, ArbeidsgiverOpplysninger>;
  dokumenter?: DokumentOpplysninger[];
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: (aksjonspunkter: InntektsmeldingRequestPayload[]) => void;
}

const InntektsmeldingIndex = ({
  behandling,
  readOnly,
  arbeidsgiverOpplysningerPerId,
  dokumenter,
  aksjonspunkter,
  submitCallback,
}: InntektsmeldingContainerProps): ReactElement => {
  const contextValue: InntektsmeldingContextType = useMemo(
    () => ({
      behandlingUuid: behandling.uuid,
      readOnly,
      arbeidsforhold: arbeidsgiverOpplysningerPerId,
      dokumenter,
      aksjonspunkter,
      onFinished: (payload: InntektsmeldingRequestPayload) => submitCallback([payload]),
    }),
    [behandling.uuid, readOnly, arbeidsgiverOpplysningerPerId, dokumenter, aksjonspunkter, submitCallback],
  );

  return (
    <InntektsmeldingContext.Provider value={contextValue}>
      <Suspense fallback={<LoadingPanel />}>
        <InntektsmeldingContainer />
      </Suspense>
    </InntektsmeldingContext.Provider>
  );
};

export default InntektsmeldingIndex;
