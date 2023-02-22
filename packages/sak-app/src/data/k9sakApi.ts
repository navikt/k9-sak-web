import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';
import { KlageBehandlingApiKeys } from '@k9-sak-web/behandling-klage/src/data/klageBehandlingApi';

// NB! ALDRI BRUK DETTE UTENFOR PAKKEN 'SAK-APP'

export enum LinkCategory {
  INIT_DATA = 'INIT_DATA',
  FEATURE_TOGGLE = 'FEATURE_TOGGLE',
  FAGSAK = 'FAGSAK',
  BEHANDLING = 'BEHANDLING',
}

export enum K9sakApiKeys {
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
  BEHANDLINGER_K9SAK = 'BEHANDLINGER_K9SAK',
  BEHANDLINGER_TILBAKE = 'BEHANDLINGER_TILBAKE',
  BEHANDLINGER_KLAGE = 'BEHANDLINGER_KLAGE',
  BEHANDLING_PERSONOPPLYSNINGER = 'BEHANDLING_PERSONOPPLYSNINGER',
  NEW_BEHANDLING_K9SAK = 'NEW_BEHANDLING_K9SAK',
  NEW_BEHANDLING_UNNTAK = 'NEW_BEHANDLING_UNNTAK',
  NEW_BEHANDLING_TILBAKE = 'NEW_BEHANDLING_TILBAKE',
  NEW_BEHANDLING_KLAGE = 'NEW_BEHANDLING_KLAGE',
  HISTORY_K9SAK = 'HISTORY_K9SAK',
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
  FAGSAK_RELATERTE_SAKER = 'FAGSAK_RELATERTE_SAKER',
  PARTER_MED_KLAGERETT = 'PARTER_MED_KLAGERETT',
  DIREKTE_OVERGANG_FRA_INFOTRYGD = 'DIREKTE_OVERGANG_FRA_INFOTRYGD',
  BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR = 'BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR',
  LOS_LAGRE_MERKNAD = 'LOS_LAGRE_MERKNAD',
  LOS_HENTE_MERKNAD = 'LOS_HENTE_MERKNAD',
}

const endpoints = new RestApiConfigBuilder()
  .withGet('/k9/sak/api/init-fetch', K9sakApiKeys.INIT_FETCH)
  .withGet('/k9/tilbake/api/init-fetch', K9sakApiKeys.INIT_FETCH_TILBAKE)
  .withGet('/k9/klage/api/init-fetch', K9sakApiKeys.INIT_FETCH_KLAGE)

  // Generelle
  .withRel('nav-ansatt', K9sakApiKeys.NAV_ANSATT)
  .withRel('saksbehandler-info', K9sakApiKeys.HENT_SAKSBEHANDLERE)
  .withRel('kodeverk', K9sakApiKeys.KODEVERK)
  .withRel('tilbake-kodeverk', K9sakApiKeys.KODEVERK_TILBAKE)
  .withRel('klage-kodeverk', K9sakApiKeys.KODEVERK_KLAGE)
  .withRel('behandlende-enheter', K9sakApiKeys.BEHANDLENDE_ENHETER)
  .withRel('arbeidsgivere', K9sakApiKeys.ARBEIDSGIVERE)

  // Feature toggles
  .withGet('/k9/feature-toggle/toggles.json', K9sakApiKeys.FEATURE_TOGGLE)

  // Fagsak
  .withRel('fagsak', K9sakApiKeys.FETCH_FAGSAK)
  .withRel('sak-bruker', K9sakApiKeys.SAK_BRUKER)
  .withRel('sak-rettigheter', K9sakApiKeys.SAK_RETTIGHETER)
  .withRel('tilbake-sak-rettigheter', K9sakApiKeys.SAK_RETTIGHETER_TILBAKE)
  .withRel('klage-sak-rettigheter', K9sakApiKeys.SAK_RETTIGHETER_KLAGE)
  .withRel('sak-historikk', K9sakApiKeys.HISTORY_K9SAK)
  .withRel('tilbake-historikk', K9sakApiKeys.HISTORY_TILBAKE)
  .withRel('klage-historikk', K9sakApiKeys.HISTORY_KLAGE)
  .withRel('sak-dokumentliste', K9sakApiKeys.ALL_DOCUMENTS)
  .withRel('sak-alle-behandlinger', K9sakApiKeys.BEHANDLINGER_K9SAK)
  .withRel('tilbake-alle-behandlinger', K9sakApiKeys.BEHANDLINGER_TILBAKE)
  .withRel('klage-alle-behandlinger', K9sakApiKeys.BEHANDLINGER_KLAGE)
  .withRel('tilbake-kan-opprette-behandling', K9sakApiKeys.KAN_TILBAKEKREVING_OPPRETTES)
  .withRel('tilbake-kan-opprette-revurdering', K9sakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES)

  // Behandling
  .withRel('soeker-personopplysninger', K9sakApiKeys.BEHANDLING_PERSONOPPLYSNINGER)
  .withRel('kontrollresultat', K9sakApiKeys.KONTROLLRESULTAT)
  .withRel('risikoklassifisering-aksjonspunkt', K9sakApiKeys.RISIKO_AKSJONSPUNKT)
  .withRel('klage-vurdering', K9sakApiKeys.TOTRINNS_KLAGE_VURDERING)
  .withRel('totrinnskontroll-arsaker', K9sakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER)
  .withRel('totrinnskontroll-arsaker-readOnly', K9sakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY)
  .withRel('har-samme-resultat', K9sakApiKeys.HAR_REVURDERING_SAMME_RESULTAT)
  .withRel('bekreft-totrinnsaksjonspunkt', K9sakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT)
  .withRel('har-apent-kontroller-revurdering-aksjonspunkt', K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP)
  .withRel('brev-maler', K9sakApiKeys.BREVMALER)
  .withRel('brev-bestill', K9sakApiKeys.SUBMIT_MESSAGE)
  .withRel('behandling-rettigheter', K9sakApiKeys.BEHANDLING_RETTIGHETER)
  .withRel('tilgjengelige-vedtaksbrev', K9sakApiKeys.TILGJENGELIGE_VEDTAKSBREV)
  .withRel('fagsak-relaterte-saker', K9sakApiKeys.FAGSAK_RELATERTE_SAKER)
  .withRel('direkte-overgang', K9sakApiKeys.DIREKTE_OVERGANG_FRA_INFOTRYGD)
  .withRel('behandling-perioder-årsak-med-vilkår', K9sakApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR)
  .withRel('los-lagre-merknad', K9sakApiKeys.LOS_LAGRE_MERKNAD)
  .withRel('los-hente-merknad', K9sakApiKeys.LOS_HENTE_MERKNAD)

  .withPost('/k9/tilbake/api/brev/forhandsvis', K9sakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING, { isResponseBlob: true })
  .withPost(
    '/k9/tilbake/api/dokument/forhandsvis-henleggelsesbrev',
    K9sakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE,
    { isResponseBlob: true },
  )
  .withAsyncPost('/k9/tilbake/api/behandlinger/opprett', K9sakApiKeys.NEW_BEHANDLING_TILBAKE)
  .withAsyncPut('/k9/sak/api/behandlinger', K9sakApiKeys.NEW_BEHANDLING_K9SAK)
  .withAsyncPut('/k9/sak/api/behandlinger/unntak', K9sakApiKeys.NEW_BEHANDLING_UNNTAK)
  .withAsyncPut('/k9/klage/api/behandlinger', K9sakApiKeys.NEW_BEHANDLING_KLAGE)
  .withGet('/k9/sak/api/aktoer-info', K9sakApiKeys.AKTOER_INFO)

  // Formidling
  .withPost('/k9/formidling/api/brev/forhaandsvis', K9sakApiKeys.PREVIEW_MESSAGE_FORMIDLING, { isResponseBlob: true })

  // Språkfil (ligg på klient - Skal fjernast - Det som ligg i denne skal flyttes til spesifikke pakker)
  .withGet('/k9/web/sprak/nb_NO.json', K9sakApiKeys.LANGUAGE_FILE)

  // Kun brukt for søk på localhost
  .withPost('/k9/sak/api/fagsak/sok', K9sakApiKeys.SEARCH_FAGSAK)
  .withPost('/k9/sak/api/fagsak/match', K9sakApiKeys.MATCH_FAGSAK)

  .withRel('parter-klagerett', KlageBehandlingApiKeys.PARTER_MED_KLAGERETT)

  .build();

export const requestApi = createRequestApi(endpoints);

export const restApiHooks = RestApiHooks.initHooks(requestApi);
