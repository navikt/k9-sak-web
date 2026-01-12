import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import type { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';
import { Suspense, useMemo, type ReactElement } from 'react';
import InntektsmeldingContext from '../context/InntektsmeldingContext';
import type {
  ArbeidsgiverOpplysninger,
  DokumentOpplysninger,
  InntektsmeldingContextType,
} from '../types/InntektsmeldingContextType';
import type AksjonspunktRequestPayload from '../types/AksjonspunktRequestPayload';
import Kompletthetsoversikt from './components/kompletthetsoversikt/Kompletthetsoversikt';

export interface InntektsmeldingContainerProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  arbeidsgiverOpplysningerPerId: Record<string, ArbeidsgiverOpplysninger>;
  dokumenter?: DokumentOpplysninger[];
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: (aksjonspunkter: AksjonspunktRequestPayload[]) => void;
}

const InntektsmeldingContainer = ({
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
      onFinished: (payload: AksjonspunktRequestPayload) => submitCallback([payload]),
    }),
    [behandling.uuid, readOnly, arbeidsgiverOpplysningerPerId, dokumenter, aksjonspunkter, submitCallback],
  );

  return (
    <InntektsmeldingContext.Provider value={contextValue}>
      <Suspense fallback={<LoadingPanel />}>
        <Kompletthetsoversikt />
      </Suspense>
    </InntektsmeldingContext.Provider>
  );
};

export default InntektsmeldingContainer;
