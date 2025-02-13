import {
  OpprettNotatDtoNotatGjelderType,
  type EndreResponse,
  type HentResponse,
  type K9SakClient,
  type OpprettResponse,
  type SkjulResponse,
} from '@k9-sak-web/backend/k9sak/generated';
import type { FormState } from './types/FormState';

export default class NotatBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getNotater(fagsakId: string): Promise<HentResponse> {
    return this.#k9sak.notat.hent({ saksnummer: fagsakId });
  }

  async opprettNotat(data: FormState, fagsakId: string): Promise<OpprettResponse> {
    const notatGjelderType = data.visNotatIAlleSaker
      ? OpprettNotatDtoNotatGjelderType.PLEIETRENGENDE
      : OpprettNotatDtoNotatGjelderType.FAGSAK;

    return this.#k9sak.notat.opprett({ notatGjelderType, notatTekst: data.notatTekst, saksnummer: fagsakId });
  }

  async endreNotat(data: FormState, notatId: string, saksnummer: string, versjon: number): Promise<EndreResponse> {
    return this.#k9sak.notat.endre({ notatTekst: data.notatTekst, notatId, saksnummer, versjon });
  }

  async skjulNotat(notatId: string, saksnummer: string, skjul: boolean, versjon: number): Promise<SkjulResponse> {
    return this.#k9sak.notat.skjul({ notatId, saksnummer, skjul, versjon });
  }
}
