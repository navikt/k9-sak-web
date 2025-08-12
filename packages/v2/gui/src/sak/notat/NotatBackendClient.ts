import {
  k9_kodeverk_notat_NotatGjelderType as OpprettNotatDtoNotatGjelderType,
  type EndreResponse as K9EndreResponse,
  type HentResponse as K9HentResponse,
  type OpprettResponse as K9OpprettResponse,
  type K9SakClient,
  type SkjulResponse as K9SkjulResponse,
} from '@k9-sak-web/backend/k9sak/generated';
import {
  UngSakClient,
  type EndreResponse as UngEndreResponse,
  type HentResponse as UngHentResponse,
  type OpprettResponse as UngOpprettResponse,
  type SkjulResponse as UngSkjulResponse,
} from '@k9-sak-web/backend/ungsak/generated';
import type { FormState } from './types/FormState';

type HentResponse = K9HentResponse | UngHentResponse;
type OpprettResponse = K9OpprettResponse | UngOpprettResponse;
type EndreResponse = K9EndreResponse | UngEndreResponse;
type SkjulResponse = K9SkjulResponse | UngSkjulResponse;
export default class NotatBackendClient {
  #backendClient: K9SakClient | UngSakClient;

  constructor(backendClient: K9SakClient | UngSakClient) {
    this.#backendClient = backendClient;
  }

  async getNotater(fagsakId: string): Promise<HentResponse> {
    return this.#backendClient.notat.hent({ saksnummer: fagsakId });
  }

  isUngSakClient(): boolean {
    return this.#backendClient instanceof UngSakClient;
  }

  async opprettNotat(data: FormState, fagsakId: string): Promise<OpprettResponse> {
    if (this.isUngSakClient()) {
      return this.#backendClient.notat.opprett({
        notatGjelderType: OpprettNotatDtoNotatGjelderType.FAGSAK,
        notatTekst: data.notatTekst,
        saksnummer: fagsakId,
      });
    }
    const notatGjelderType = data.visNotatIAlleSaker
      ? OpprettNotatDtoNotatGjelderType.PLEIETRENGENDE
      : OpprettNotatDtoNotatGjelderType.FAGSAK;

    const client = this.#backendClient as K9SakClient;
    return client.notat.opprett({ notatGjelderType, notatTekst: data.notatTekst, saksnummer: fagsakId });
  }

  async endreNotat(data: FormState, notatId: string, saksnummer: string, versjon: number): Promise<EndreResponse> {
    return this.#backendClient.notat.endre({ notatTekst: data.notatTekst, notatId, saksnummer, versjon });
  }

  async skjulNotat(notatId: string, saksnummer: string, skjul: boolean, versjon: number): Promise<SkjulResponse> {
    return this.#backendClient.notat.skjul({ notatId, saksnummer, skjul, versjon });
  }
}
