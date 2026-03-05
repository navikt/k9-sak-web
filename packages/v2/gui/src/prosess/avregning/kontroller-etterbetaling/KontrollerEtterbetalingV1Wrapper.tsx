// må wrappe v1 med provider

import { useMemo } from 'react';
import K9SakAvregningBackendClient from '../AvregningBackendClient';
import { AvregningBackendClientContext } from '../AvregningBackendClientContext';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';

// provider for KontrollerEtterbetalingIndex, slik at den kan brukes i v1 og v2 uten å endre kode i selve komponenten
// Årsaken til at denne kun trengs for k9sak er at KontrollerEtterbetalingIndex har blitt skrevet om til v2 tidligere
// og er KontrollerEtterbetaling er kun et aksjonspunkt i k9sak, og ikke i ungsak.

// kan slettes når v1 fjernes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type deleteFile = FeatureToggles['BRUK_V2_AVREGNING'];
const KontrollerEtterbetalingV1Wrapper = ({ children }: { children: React.ReactNode }) => {
  const client = useMemo(() => new K9SakAvregningBackendClient(), []);
  return <AvregningBackendClientContext value={client}>{children}</AvregningBackendClientContext>;
};

export default KontrollerEtterbetalingV1Wrapper;
