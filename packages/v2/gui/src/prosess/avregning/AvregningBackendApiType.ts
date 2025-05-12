import type { BekreftData, BekreftResponse } from '@k9-sak-web/backend/k9sak/generated';

export type BehandlingAvregningBackendApiType = {
  bekreftAksjonspunkt(requestBody: BekreftData['requestBody']): Promise<BekreftResponse>;
};
