// må wrappe v1 med provider

import { useMemo } from 'react';
import { AvregningBackendClientProvider } from '../AvregningBackendClientContext';
import AvregningBackendClient from '../AvregningBackendClient';

// provider for KontrollerEtterbetalingIndex, slik at den kan brukes i v1 og v2 uten å endre kode i selve komponenten
// kan slettes når v1 fjernes
const KontrollerEtterbetalingV1Wrapper = ({ children }: { children: React.ReactNode }) => {
  const client = useMemo(() => new AvregningBackendClient(), []);
  return <AvregningBackendClientProvider client={client}>{children}</AvregningBackendClientProvider>;
};

export default KontrollerEtterbetalingV1Wrapper;
