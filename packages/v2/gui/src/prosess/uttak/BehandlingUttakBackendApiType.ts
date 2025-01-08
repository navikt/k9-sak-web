import type { BekreftData, BekreftResponse, EgneOverlappendeSakerDto } from '@k9-sak-web/backend/k9sak/generated';

export type BehandlingUttakBackendApiType = {
  getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto>;
  bekreftAksjonspunkt(requestBody: BekreftData['requestBody']): Promise<BekreftResponse>;
};
