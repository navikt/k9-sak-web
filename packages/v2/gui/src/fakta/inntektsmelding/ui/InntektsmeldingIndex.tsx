import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { ArbeidsgiverOpplysningerDto } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/ArbeidsgiverOpplysningerDto.js';
import type { DokumentDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/DokumentDto.js';
import { Suspense, useMemo } from 'react';
import InntektsmeldingContext from '../context/InntektsmeldingContext';
import type { InntektsmeldingContextType, InntektsmeldingRequestPayload } from '../types';
import InntektsmeldingContainer from './components/InntektsmeldingContainer';
import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';

export interface InntektsmeldingContainerProps {
  behandling: BehandlingDto;
  readOnly: boolean;
  arbeidsgiverOpplysningerPerId: Record<string, ArbeidsgiverOpplysningerDto>;
  dokumenter?: DokumentDto[];
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
}: InntektsmeldingContainerProps) => {
  const contextValue: InntektsmeldingContextType = useMemo(
    () => ({
      behandling,
      readOnly,
      arbeidsforhold: arbeidsgiverOpplysningerPerId,
      dokumenter,
      aksjonspunkter,
      onFinished: (payload: InntektsmeldingRequestPayload) => submitCallback([payload]),
    }),
    [behandling, readOnly, arbeidsgiverOpplysningerPerId, dokumenter, aksjonspunkter, submitCallback],
  );
  return (
    <InntektsmeldingContext value={contextValue}>
      <Suspense fallback={<LoadingPanel />}>
        <InntektsmeldingContainer />
      </Suspense>
    </InntektsmeldingContext>
  );
};

export default InntektsmeldingIndex;
