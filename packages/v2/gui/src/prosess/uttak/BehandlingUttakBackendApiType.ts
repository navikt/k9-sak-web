import type {
  BekreftData,
  k9_sak_kontrakt_uttak_søskensaker_EgneOverlappendeSakerDto as EgneOverlappendeSakerDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export type BehandlingUttakBackendApiType = {
  getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto>;
  bekreftAksjonspunkt(requestBody: BekreftData['body']): Promise<void>;
};
