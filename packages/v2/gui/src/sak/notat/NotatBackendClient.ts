import { OpprettNotatDtoNotatGjelderType } from '@k9-sak-web/backend/k9sak/kodeverk/notat/OpprettNotatDtoNotatGjelderType.js';
import type { K9EndreResponse } from '@k9-sak-web/backend/k9sak/tjenester/K9EndreResponse.js';
import type { K9HentResponse } from '@k9-sak-web/backend/k9sak/tjenester/K9HentResponse.js';
import type { K9OpprettResponse } from '@k9-sak-web/backend/k9sak/tjenester/K9OpprettResponse.js';
import type { K9SkjulResponse } from '@k9-sak-web/backend/k9sak/tjenester/K9SkjulResponse.js';
import { NotatGjelderType } from '@k9-sak-web/backend/ungsak/kodeverk/notat/NotatGjelderType.js';
import type { UngEndreResponse } from '@k9-sak-web/backend/ungsak/tjenester/UngEndreResponse.js';
import type { UngHentResponse } from '@k9-sak-web/backend/ungsak/tjenester/UngHentResponse.js';
import type { UngOpprettResponse } from '@k9-sak-web/backend/ungsak/tjenester/UngOpprettResponse.js';
import type { UngSkjulResponse } from '@k9-sak-web/backend/ungsak/tjenester/UngSkjulResponse.js';
import type { FormState } from './types/FormState';
import {
  hentNotater as k9sak_notat_hent,
  opprettNotat as k9sak_notat_opprett,
  endreNotat as k9sak_notat_endre,
  skjulNotat as k9sak_notat_skjul,
} from '@k9-sak-web/backend/k9sak/sdk.js';
import {
  hentNotater as ungsak_notat_hent,
  opprettNotat as ungsak_notat_opprett,
  endreNotat as ungsak_notat_endre,
  skjulNotat as ungsak_notat_skjul,
} from '@k9-sak-web/backend/ungsak/sdk.js';
import { k9SakOrUngSak, type K9SakOrUngSak } from '../../utils/multibackend.js';

type HentResponse = K9HentResponse | UngHentResponse;
type OpprettResponse = K9OpprettResponse | UngOpprettResponse;
type EndreResponse = K9EndreResponse | UngEndreResponse;
type SkjulResponse = K9SkjulResponse | UngSkjulResponse;
export default class NotatBackendClient {
  #backendChoice: K9SakOrUngSak;

  constructor(backendChoice: K9SakOrUngSak) {
    this.#backendChoice = backendChoice;
  }

  async getNotater(fagsakId: string): Promise<HentResponse> {
    if (this.#backendChoice === k9SakOrUngSak.ungSak) {
      return (await ungsak_notat_hent({ query: { saksnummer: { saksnummer: fagsakId } } })).data;
    }
    return (await k9sak_notat_hent({ query: { saksnummer: { saksnummer: fagsakId } } })).data;
  }

  async opprettNotat(data: FormState, fagsakId: string): Promise<OpprettResponse> {
    if (this.#backendChoice === k9SakOrUngSak.ungSak) {
      return (
        await ungsak_notat_opprett({
          body: {
            notatGjelderType: NotatGjelderType.FAGSAK,
            notatTekst: data.notatTekst,
            saksnummer: fagsakId,
          },
        })
      ).data;
    }

    const notatGjelderType = data.visNotatIAlleSaker
      ? OpprettNotatDtoNotatGjelderType.PLEIETRENGENDE
      : OpprettNotatDtoNotatGjelderType.FAGSAK;
    return (
      await k9sak_notat_opprett({ body: { notatGjelderType, notatTekst: data.notatTekst, saksnummer: fagsakId } })
    ).data;
  }

  async endreNotat(data: FormState, notatId: string, saksnummer: string, versjon: number): Promise<EndreResponse> {
    if (this.#backendChoice === k9SakOrUngSak.ungSak) {
      return (await ungsak_notat_endre({ body: { notatTekst: data.notatTekst, notatId, saksnummer, versjon } })).data;
    } else {
      return (await k9sak_notat_endre({ body: { notatTekst: data.notatTekst, notatId, saksnummer, versjon } })).data;
    }
  }

  async skjulNotat(notatId: string, saksnummer: string, skjul: boolean, versjon: number): Promise<SkjulResponse> {
    if (this.#backendChoice === k9SakOrUngSak.ungSak) {
      return (await ungsak_notat_skjul({ body: { notatId, saksnummer, skjul, versjon } })).data;
    } else {
      return (await k9sak_notat_skjul({ body: { notatId, saksnummer, skjul, versjon } })).data;
    }
  }
}
