import {
  notat_endre as k9sak_notat_endre,
  notat_hent as k9sak_notat_hent,
  notat_opprett as k9sak_notat_opprett,
  notat_skjul as k9sak_notat_skjul,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import {
  k9_kodeverk_notat_NotatGjelderType,
  type EndreResponse as K9EndreResponse,
  type HentResponse as K9HentResponse,
  type OpprettResponse as K9OpprettResponse,
  type SkjulResponse as K9SkjulResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  notat_endre as ungsak_notat_endre,
  notat_hent as ungsak_notat_hent,
  notat_opprett as ungsak_notat_opprett,
  notat_skjul as ungsak_notat_skjul,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import {
  ung_kodeverk_notat_NotatGjelderType,
  type EndreResponse as UngEndreResponse,
  type HentResponse as UngHentResponse,
  type OpprettResponse as UngOpprettResponse,
  type SkjulResponse as UngSkjulResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { k9SakOrUngSak, type K9SakOrUngSak } from '../../utils/multibackend.js';
import type { FormState } from './types/FormState';

type HentResponse = K9HentResponse | UngHentResponse;
type OpprettResponse = K9OpprettResponse | UngOpprettResponse;
type EndreResponse = K9EndreResponse | UngEndreResponse;
type SkjulResponse = K9SkjulResponse | UngSkjulResponse;
export default class NotatBackendClient {
  readonly backend: K9SakOrUngSak;

  constructor(backend: K9SakOrUngSak) {
    this.backend = backend;
  }

  async getNotater(fagsakId: string): Promise<HentResponse> {
    if (this.backend === k9SakOrUngSak.ungSak) {
      return (await ungsak_notat_hent({ query: { saksnummer: { saksnummer: fagsakId } } })).data;
    }
    return (await k9sak_notat_hent({ query: { saksnummer: { saksnummer: fagsakId } } })).data;
  }

  async opprettNotat(data: FormState, fagsakId: string): Promise<OpprettResponse> {
    if (this.backend === k9SakOrUngSak.ungSak) {
      return (
        await ungsak_notat_opprett({
          body: {
            notatGjelderType: ung_kodeverk_notat_NotatGjelderType.FAGSAK,
            notatTekst: data.notatTekst,
            saksnummer: fagsakId,
          },
        })
      ).data;
    }

    const notatGjelderType = data.visNotatIAlleSaker
      ? k9_kodeverk_notat_NotatGjelderType.PLEIETRENGENDE
      : k9_kodeverk_notat_NotatGjelderType.FAGSAK;
    return (
      await k9sak_notat_opprett({ body: { notatGjelderType, notatTekst: data.notatTekst, saksnummer: fagsakId } })
    ).data;
  }

  async endreNotat(data: FormState, notatId: string, saksnummer: string, versjon: number): Promise<EndreResponse> {
    if (this.backend === k9SakOrUngSak.ungSak) {
      return (await ungsak_notat_endre({ body: { notatTekst: data.notatTekst, notatId, saksnummer, versjon } })).data;
    } else {
      return (await k9sak_notat_endre({ body: { notatTekst: data.notatTekst, notatId, saksnummer, versjon } })).data;
    }
  }

  async skjulNotat(notatId: string, saksnummer: string, skjul: boolean, versjon: number): Promise<SkjulResponse> {
    if (this.backend === k9SakOrUngSak.ungSak) {
      return (await ungsak_notat_skjul({ body: { notatId, saksnummer, skjul, versjon } })).data;
    } else {
      return (await k9sak_notat_skjul({ body: { notatId, saksnummer, skjul, versjon } })).data;
    }
  }
}
