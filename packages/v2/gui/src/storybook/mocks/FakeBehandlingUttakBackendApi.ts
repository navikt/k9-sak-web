import type { k9_sak_kontrakt_uttak_søskensaker_EgneOverlappendeSakerDto as EgneOverlappendeSakerDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { BehandlingUttakBackendApiType } from '../../prosess/uttak/BehandlingUttakBackendApiType';
import type { BekreftVurderOverlappendeSakerAksjonspunktRequest } from '../../prosess/uttak/vurder-overlappende-sak/VurderOverlappendeSak';

export class FakeBehandlingUttakBackendApi implements BehandlingUttakBackendApiType {
  #egneOverlappendeSaker: EgneOverlappendeSakerDto[];
  #bekreftAksjonspunkt: BekreftVurderOverlappendeSakerAksjonspunktRequest | undefined;

  constructor(egneOverlappendeSaker: EgneOverlappendeSakerDto[]) {
    this.#egneOverlappendeSaker = egneOverlappendeSaker;
  }
  async getEgneOverlappendeSaker(behandlingUuid: string) {
    const egneOverlappendeSaker = this.#egneOverlappendeSaker[Number(behandlingUuid)] || { perioderMedOverlapp: [] };
    return egneOverlappendeSaker;
  }

  async bekreftAksjonspunkt(requestBody: BekreftVurderOverlappendeSakerAksjonspunktRequest) {
    console.log('Bekreft aksjonspunkt', requestBody);
    this.#bekreftAksjonspunkt = requestBody;
  }

  get sisteBekreftAksjonspunktResultat() {
    return this.#bekreftAksjonspunkt;
  }

  reset() {
    this.#bekreftAksjonspunkt = undefined;
  }
}
