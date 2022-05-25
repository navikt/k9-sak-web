import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum UtvidetRettBehandlingApiKeys {
  BEHANDLING_UTVIDET_RETT = 'BEHANDLING_UTVIDET_RETT',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE = 'PREVIEW_TILBAKEKREVING_MESSAGE',
  AKSJONSPUNKTER = 'AKSJONSPUNKTER',
  VILKAR = 'VILKAR',
  PERSONOPPLYSNINGER = 'PERSONOPPLYSNINGER',
  TILBAKEKREVINGVALG = 'TILBAKEKREVINGVALG',
  SOKNAD = 'SOKNAD',
  MEDLEMSKAP = 'MEDLEMSKAP',
  VERGE = 'VERGE',
  SEND_VARSEL_OM_REVURDERING = 'SEND_VARSEL_OM_REVURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  VERGE_OPPRETT = 'VERGE_OPPRETT',
  VERGE_FJERN = 'VERGE_FJERN',
  RAMMEVEDTAK = 'RAMMEVEDTAK',
  TILGJENGELIGE_VEDTAKSBREV = 'TILGJENGELIGE_VEDTAKSBREV',
  DOKUMENTDATA_LAGRE = 'DOKUMENTDATA_LAGRE',
  DOKUMENTDATA_HENTE = 'DOKUMENTDATA_HENTE',
  OMSORGEN_FOR = 'OMSORGEN_FOR',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', UtvidetRettBehandlingApiKeys.BEHANDLING_UTVIDET_RETT)

  // behandlingsdata
  .withRel('omsorgen-for', UtvidetRettBehandlingApiKeys.OMSORGEN_FOR)
  .withRel('aksjonspunkter', UtvidetRettBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', UtvidetRettBehandlingApiKeys.VILKAR)
  .withRel('soknad', UtvidetRettBehandlingApiKeys.SOKNAD)
  .withRel('soeker-personopplysninger', UtvidetRettBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('rammevedtak', UtvidetRettBehandlingApiKeys.RAMMEVEDTAK)

  // Brukes av vedtakpanel
  .withRel('tilbakekrevingvalg', UtvidetRettBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('sendt-varsel-om-revurdering', UtvidetRettBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('soeker-medlemskap-v2', UtvidetRettBehandlingApiKeys.MEDLEMSKAP)
  .withRel('tilgjengelige-vedtaksbrev', UtvidetRettBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)

  // operasjoner
  .withRel('dokumentdata-lagre', UtvidetRettBehandlingApiKeys.DOKUMENTDATA_LAGRE)
  .withRel('dokumentdata-hente', UtvidetRettBehandlingApiKeys.DOKUMENTDATA_HENTE)

  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', UtvidetRettBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', UtvidetRettBehandlingApiKeys.SAVE_AKSJONSPUNKT)

  .withPost('/k9/sak/api/behandlinger/bytt-enhet', UtvidetRettBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', UtvidetRettBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', UtvidetRettBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', UtvidetRettBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/verge/opprett', UtvidetRettBehandlingApiKeys.VERGE_OPPRETT)
  .withPost('/k9/sak/api/verge/fjern', UtvidetRettBehandlingApiKeys.VERGE_FJERN)

  /* FPTILBAKE */
  .withPost(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    UtvidetRettBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
    { isResponseBlob: true },
  )

  /* K9FORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', UtvidetRettBehandlingApiKeys.PREVIEW_MESSAGE, {
    isResponseBlob: true,
  })

  .build();

export const requestUtvidetRettApi = createRequestApi(endpoints);

export const restApiUtvidetRettHooks = RestApiHooks.initHooks(requestUtvidetRettApi);
