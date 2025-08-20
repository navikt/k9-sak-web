import {
  k9_kodeverk_notat_NotatGjelderType as OpprettNotatDtoNotatGjelderType,
  type EndreResponse as K9EndreResponse,
  type HentResponse as K9HentResponse,
  type OpprettResponse as K9OpprettResponse,
  type SkjulResponse as K9SkjulResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  UngSakClient,
  type EndreResponse as UngEndreResponse,
  type HentResponse as UngHentResponse,
  type OpprettResponse as UngOpprettResponse,
  type SkjulResponse as UngSkjulResponse,
} from '@k9-sak-web/backend/ungsak/generated';
import type { FormState } from './types/FormState';
import { getUngSakClient } from '@k9-sak-web/backend/ungsak/client';
import {
  notat_hent as k9sak_notat_hent,
  notat_opprett as k9sak_notat_opprett,
  notat_endre as k9sak_notat_endre,
  notat_skjul as k9sak_notat_skjul,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { k9SakOrUngSak, type K9SakOrUngSak } from '../../utils/multibackend.js';

type HentResponse = K9HentResponse | UngHentResponse;
type OpprettResponse = K9OpprettResponse | UngOpprettResponse;
type EndreResponse = K9EndreResponse | UngEndreResponse;
type SkjulResponse = K9SkjulResponse | UngSkjulResponse;
export default class NotatBackendClient {
  #backendChoice: K9SakOrUngSak;
  #backendClient: UngSakClient | null = null;

  constructor(backendChoice: K9SakOrUngSak) {
    this.#backendChoice = backendChoice;
    if (this.#backendChoice === k9SakOrUngSak.ungSak) {
      this.#backendClient = getUngSakClient();
    }
  }

  async getNotater(fagsakId: string): Promise<HentResponse> {
    if (this.#backendClient != null) {
      return this.#backendClient.notat.hent({ saksnummer: fagsakId });
    }
    return (await k9sak_notat_hent({ query: { saksnummer: { saksnummer: fagsakId } } })).data;
  }

  async opprettNotat(data: FormState, fagsakId: string): Promise<OpprettResponse> {
    if (this.#backendClient != null) {
      return this.#backendClient.notat.opprett({
        notatGjelderType: OpprettNotatDtoNotatGjelderType.FAGSAK,
        notatTekst: data.notatTekst,
        saksnummer: fagsakId,
      });
    }
    const notatGjelderType = data.visNotatIAlleSaker
      ? OpprettNotatDtoNotatGjelderType.PLEIETRENGENDE
      : OpprettNotatDtoNotatGjelderType.FAGSAK;

    return (
      await k9sak_notat_opprett({ body: { notatGjelderType, notatTekst: data.notatTekst, saksnummer: fagsakId } })
    ).data;
  }

  async endreNotat(data: FormState, notatId: string, saksnummer: string, versjon: number): Promise<EndreResponse> {
    if (this.#backendClient != null) {
      return this.#backendClient.notat.endre({ notatTekst: data.notatTekst, notatId, saksnummer, versjon });
    } else {
      return (await k9sak_notat_endre({ body: { notatTekst: data.notatTekst, notatId, saksnummer, versjon } })).data;
    }
  }

  async skjulNotat(notatId: string, saksnummer: string, skjul: boolean, versjon: number): Promise<SkjulResponse> {
    if (this.#backendClient != null) {
      return this.#backendClient.notat.skjul({ notatId, saksnummer, skjul, versjon });
    } else {
      return (await k9sak_notat_skjul({ body: { notatId, saksnummer, skjul, versjon } })).data;
    }
  }
}
