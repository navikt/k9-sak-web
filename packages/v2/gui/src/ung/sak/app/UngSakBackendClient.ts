import type {
  AlleKodeverdierSomObjektResponse2,
  HentBrukerForFagsakResponse,
  HentFagsakResponse,
  HentRettigheterResponse,
  UngSakClient,
} from '@k9-sak-web/backend/ungsak/generated';

export default class UngSakBackendClient {
  #ungsak: UngSakClient;

  constructor(ungsak: UngSakClient) {
    this.#ungsak = ungsak;
  }

  async getFagsak(saksnummer: string): Promise<HentFagsakResponse> {
    return this.#ungsak.fagsak.hentFagsak({ saksnummer });
  }

  async getFagsakPerson(saksnummer: string): Promise<HentBrukerForFagsakResponse> {
    return this.#ungsak.fagsak.hentBrukerForFagsak({ saksnummer });
  }

  async getAlleKodeverk(): Promise<AlleKodeverdierSomObjektResponse2> {
    return this.#ungsak.kodeverk.alleKodeverdierSomObjekt();
  }

  async getSakRettigheterUngSak(saksnummer: string): Promise<HentRettigheterResponse> {
    return this.#ungsak.fagsak.hentRettigheter({ saksnummer });
  }
}
