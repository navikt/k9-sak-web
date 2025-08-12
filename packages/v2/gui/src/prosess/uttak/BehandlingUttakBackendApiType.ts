import type {
  BekreftData,
  BekreftResponse,
  k9_sak_kontrakt_uttak_søskensaker_EgneOverlappendeSakerDto as EgneOverlappendeSakerDto,
} from '@k9-sak-web/backend/k9sak/generated';

export type BehandlingUttakBackendApiType = {
  getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto>;
  bekreftAksjonspunkt(requestBody: BekreftData['requestBody']): Promise<BekreftResponse>;
};
