import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR PAKKEN 'SAK-APP'

export enum LinkCategory {
  INIT_DATA = 'INIT_DATA',
  FEATURE_TOGGLE = 'FEATURE_TOGGLE',
  FAGSAK = 'FAGSAK',
  BEHANDLING = 'BEHANDLING',
}

export enum UngSakApiKeys {
  INIT_FETCH = 'INIT_FETCH',
  INIT_FETCH_TILBAKE = 'INIT_FETCH_TILBAKE',
  INIT_FETCH_KLAGE = 'INIT_FETCH_KLAGE',
  KODEVERK = 'KODEVERK',
  KODEVERK_TILBAKE = 'KODEVERK_TILBAKE',
  KODEVERK_KLAGE = 'KODEVERK_KLAGE',
  LANGUAGE_FILE = 'LANGUAGE_FILE',
  NAV_ANSATT = 'NAV_ANSATT',
  HENT_SAKSBEHANDLERE = 'HENT_SAKSBEHANDLERE',
  BEHANDLENDE_ENHETER = 'BEHANDLENDE_ENHETER',
  FEATURE_TOGGLE = 'FEATURE_TOGGLE',
  SEARCH_FAGSAK = 'SEARCH_FAGSAK',
  MATCH_FAGSAK = 'MATCH_FAGSAK',
  FETCH_FAGSAK = 'FETCH_FAGSAK',
  SAK_BRUKER = 'SAK_BRUKER',
  BEHANDLINGER_UNGSAK = 'BEHANDLINGER_UNGSAK',
  BEHANDLINGER_TILBAKE = 'BEHANDLINGER_TILBAKE',
  BEHANDLINGER_KLAGE = 'BEHANDLINGER_KLAGE',
  BEHANDLING_PERSONOPPLYSNINGER = 'BEHANDLING_PERSONOPPLYSNINGER',
  NEW_BEHANDLING_UNGSAK = 'NEW_BEHANDLING_UNGSAK',
  NEW_BEHANDLING_REVURDERING_FRA_STEG_UNGSAK = 'NEW_BEHANDLING_REVURDERING_FRA_STEG_UNGSAK',
  NEW_BEHANDLING_UNNTAK = 'NEW_BEHANDLING_UNNTAK',
  NEW_BEHANDLING_TILBAKE = 'NEW_BEHANDLING_TILBAKE',
  NEW_BEHANDLING_KLAGE = 'NEW_BEHANDLING_KLAGE',
  HISTORY_UNGSAK = 'HISTORY_UNGSAK',
  HISTORY_TILBAKE = 'HISTORY_TILBAKE',
  HISTORY_KLAGE = 'HISTORY_KLAGE',
  KONTROLLRESULTAT = 'KONTROLLRESULTAT',
  RISIKO_AKSJONSPUNKT = 'RISIKO_AKSJONSPUNKT',
  TOTRINNS_KLAGE_VURDERING = 'TOTRINNS_KLAGE_VURDERING',
  TOTRINNSAKSJONSPUNKT_ARSAKER = 'TOTRINNSAKSJONSPUNKT_ARSAKER',
  TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY = 'TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY',
  AKTOER_INFO = 'AKTOER_INFO',
  ALL_DOCUMENTS = 'ALL_DOCUMENTS',
  HAR_REVURDERING_SAMME_RESULTAT = 'HAR_REVURDERING_SAMME_RESULTAT',
  SAVE_TOTRINNSAKSJONSPUNKT = 'SAVE_TOTRINNSAKSJONSPUNKT',
  HAR_APENT_KONTROLLER_REVURDERING_AP = 'HAR_APENT_KONTROLLER_REVURDERING_AP',
  BREVMALER = 'BREVMALER',
  SUBMIT_MESSAGE = 'SUBMIT_MESSAGE',
  SAK_RETTIGHETER = 'SAK_RETTIGHETER',
  SAK_RETTIGHETER_TILBAKE = 'SAK_RETTIGHETER_TILBAKE',
  SAK_RETTIGHETER_KLAGE = 'SAK_RETTIGHETER_KLAGE',
  BEHANDLING_RETTIGHETER = 'BEHANDLING_RETTIGHETER',
  KAN_TILBAKEKREVING_OPPRETTES = 'KAN_TILBAKEKREVING_OPPRETTES',
  KAN_TILBAKEKREVING_REVURDERING_OPPRETTES = 'KAN_TILBAKEKREVING_REVURDERING_OPPRETTES',
  PREVIEW_MESSAGE_TILBAKEKREVING = 'PREVIEW_MESSAGE_TILBAKEKREVING',
  PREVIEW_MESSAGE_FORMIDLING = 'PREVIEW_MESSAGE_FORMIDLING',
  PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE = 'PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE',
  TILGJENGELIGE_VEDTAKSBREV = 'TILGJENGELIGE_VEDTAKSBREV',
  ARBEIDSGIVERE = 'ARBEIDSGIVERE',
  PARTER_MED_KLAGERETT = 'PARTER_MED_KLAGERETT',
  BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR = 'BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR',
  LOS_LAGRE_MERKNAD = 'LOS_LAGRE_MERKNAD',
  LOS_HENTE_MERKNAD = 'LOS_HENTE_MERKNAD',
  BREV_MOTTAKER_ORGANISASJON = 'BREV_MOTTAKER_ORGANISASJON',
}

const endpoints = new RestApiConfigBuilder()
  .withGet('/ung/sak/api/init-fetch', UngSakApiKeys.INIT_FETCH)
  .withGet('/ung/tilbake/api/init-fetch', UngSakApiKeys.INIT_FETCH_TILBAKE)
  .withGet('/ung/klage/api/init-fetch', UngSakApiKeys.INIT_FETCH_KLAGE)

  // Generelle
  .withRel('nav-ansatt', UngSakApiKeys.NAV_ANSATT)
  .withRel('saksbehandler-info', UngSakApiKeys.HENT_SAKSBEHANDLERE)
  .withRel('kodeverk', UngSakApiKeys.KODEVERK)
  .withRel('tilbake-kodeverk', UngSakApiKeys.KODEVERK_TILBAKE)
  .withRel('klage-kodeverk', UngSakApiKeys.KODEVERK_KLAGE)
  .withRel('behandlende-enheter', UngSakApiKeys.BEHANDLENDE_ENHETER)
  .withRel('arbeidsgivere', UngSakApiKeys.ARBEIDSGIVERE)
  .withPost('/ung/sak/api/brev/mottaker-info/ereg', UngSakApiKeys.BREV_MOTTAKER_ORGANISASJON)

  // Feature toggles
  .withGet('/ung/feature-toggle/toggles.json', UngSakApiKeys.FEATURE_TOGGLE)

  // Fagsak
  .withRel('fagsak', UngSakApiKeys.FETCH_FAGSAK)
  .withRel('sak-bruker', UngSakApiKeys.SAK_BRUKER)
  .withRel('sak-rettigheter', UngSakApiKeys.SAK_RETTIGHETER)
  .withRel('tilbake-sak-rettigheter', UngSakApiKeys.SAK_RETTIGHETER_TILBAKE)
  .withRel('klage-sak-rettigheter', UngSakApiKeys.SAK_RETTIGHETER_KLAGE)
  .withRel('sak-historikk', UngSakApiKeys.HISTORY_UNGSAK)
  .withRel('tilbake-historikk', UngSakApiKeys.HISTORY_TILBAKE)
  .withRel('klage-historikk', UngSakApiKeys.HISTORY_KLAGE)
  .withRel('sak-dokumentliste', UngSakApiKeys.ALL_DOCUMENTS)
  .withRel('sak-alle-behandlinger', UngSakApiKeys.BEHANDLINGER_UNGSAK)
  .withRel('tilbake-alle-behandlinger', UngSakApiKeys.BEHANDLINGER_TILBAKE)
  .withRel('klage-alle-behandlinger', UngSakApiKeys.BEHANDLINGER_KLAGE)
  .withRel('tilbake-kan-opprette-behandling', UngSakApiKeys.KAN_TILBAKEKREVING_OPPRETTES)
  .withRel('tilbake-kan-opprette-revurdering', UngSakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES)

  // Behandling
  .withRel('soeker-personopplysninger', UngSakApiKeys.BEHANDLING_PERSONOPPLYSNINGER)
  .withRel('kontrollresultat', UngSakApiKeys.KONTROLLRESULTAT)
  .withRel('risikoklassifisering-aksjonspunkt', UngSakApiKeys.RISIKO_AKSJONSPUNKT)
  .withRel('klage-vurdering', UngSakApiKeys.TOTRINNS_KLAGE_VURDERING)
  .withRel('totrinnskontroll-arsaker', UngSakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER)
  .withRel('totrinnskontroll-arsaker-readOnly', UngSakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY)
  .withRel('har-samme-resultat', UngSakApiKeys.HAR_REVURDERING_SAMME_RESULTAT)
  .withRel('bekreft-totrinnsaksjonspunkt', UngSakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT)
  .withRel('har-apent-kontroller-revurdering-aksjonspunkt', UngSakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP)
  .withRel('brev-maler', UngSakApiKeys.BREVMALER)
  .withRel('brev-bestill', UngSakApiKeys.SUBMIT_MESSAGE)
  .withRel('behandling-rettigheter', UngSakApiKeys.BEHANDLING_RETTIGHETER)
  .withRel('tilgjengelige-vedtaksbrev', UngSakApiKeys.TILGJENGELIGE_VEDTAKSBREV)
  .withRel('behandling-perioder-årsak-med-vilkår', UngSakApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR)
  .withRel('los-lagre-merknad', UngSakApiKeys.LOS_LAGRE_MERKNAD)
  .withRel('los-hente-merknad', UngSakApiKeys.LOS_HENTE_MERKNAD)

  .withPost('/ung/tilbake/api/brev/forhandsvis', UngSakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING, { isResponseBlob: true })
  .withPost(
    '/ung/tilbake/api/dokument/forhandsvis-henleggelsesbrev',
    UngSakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE,
    { isResponseBlob: true },
  )
  .withAsyncPost('/ung/tilbake/api/behandlinger/opprett', UngSakApiKeys.NEW_BEHANDLING_TILBAKE)
  .withAsyncPost(
    '/ung/sak/api/behandlinger/revurder-periode-fra-steg',
    UngSakApiKeys.NEW_BEHANDLING_REVURDERING_FRA_STEG_UNGSAK,
  )
  .withAsyncPut('/ung/sak/api/behandlinger', UngSakApiKeys.NEW_BEHANDLING_UNGSAK)
  .withAsyncPut('/ung/sak/api/behandlinger/unntak', UngSakApiKeys.NEW_BEHANDLING_UNNTAK)
  .withAsyncPut('/ung/klage/api/behandlinger', UngSakApiKeys.NEW_BEHANDLING_KLAGE)
  .withGet('/ung/sak/api/aktoer-info', UngSakApiKeys.AKTOER_INFO)

  // Formidling
  .withPost('/ung/formidling/api/brev/forhaandsvis', UngSakApiKeys.PREVIEW_MESSAGE_FORMIDLING, { isResponseBlob: true })

  // Språkfil (ligg på klient - Skal fjernast - Det som ligg i denne skal flyttes til spesifikke pakker)
  .withGet('/ung/web/sprak/nb_NO.json', UngSakApiKeys.LANGUAGE_FILE)

  // Kun brukt for søk på localhost
  .withPost('/ung/sak/api/fagsak/sok', UngSakApiKeys.SEARCH_FAGSAK)
  .withPost('/ung/sak/api/fagsak/match', UngSakApiKeys.MATCH_FAGSAK)

  .build();

export const requestApi = createRequestApi(endpoints);

export const restApiHooks = RestApiHooks.initHooks(requestApi);
