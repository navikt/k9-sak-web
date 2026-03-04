import type { BekreftData } from '@k9-sak-web/backend/k9sak/tjenester/BekreftData.js';
import type { EgneOverlappendeSakerDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/søskensaker/EgneOverlappendeSakerDto.js';

export type BehandlingUttakBackendApiType = {
  getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto>;
  bekreftAksjonspunkt(requestBody: BekreftData['body']): Promise<void>;
};
