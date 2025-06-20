import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum UngdomsytelseBehandlingApiKeys {
  BEHANDLING_UU = 'BEHANDLING_UU',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT = 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE = 'PREVIEW_TILBAKEKREVING_MESSAGE',
  HENT_FRITEKSTBREV_HTML = 'HENT_FRITEKSTBREV_HTML',
  AKSJONSPUNKTER = 'AKSJONSPUNKTER',
  VILKAR = 'VILKAR',
  SOKNADSFRIST_STATUS = 'SOKNADSFRIST_STATUS',
  PERSONOPPLYSNINGER = 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT = 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG = 'TILBAKEKREVINGVALG',
  SOKNAD = 'SOKNAD',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  KONTROLLER_INNTEKT = 'KONTROLLER_INNTEKT',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/ung/sak/api/behandlinger', UngdomsytelseBehandlingApiKeys.BEHANDLING_UU)

  // behandlingsdata
  .withRel('aksjonspunkter', UngdomsytelseBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', UngdomsytelseBehandlingApiKeys.VILKAR)
  .withRel('soknadsfrist-status', UngdomsytelseBehandlingApiKeys.SOKNADSFRIST_STATUS)
  .withRel('soeker-personopplysninger', UngdomsytelseBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', UngdomsytelseBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', UngdomsytelseBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('soknad', UngdomsytelseBehandlingApiKeys.SOKNAD)
  .withRel('kontroller-inntekt-perioder', UngdomsytelseBehandlingApiKeys.KONTROLLER_INNTEKT)

  // TODO Flytt alle endepunkter under til backend på same måte som i fp-frontend
  .withPost('/ung/sak/api/behandlinger/endre-pa-vent', UngdomsytelseBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/ung/sak/api/behandling/aksjonspunkt', UngdomsytelseBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost(
    '/ung/sak/api/behandling/aksjonspunkt/overstyr',
    UngdomsytelseBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
  )

  .withPost('/ung/sak/api/behandlinger/bytt-enhet', UngdomsytelseBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/ung/sak/api/behandlinger/henlegg', UngdomsytelseBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/ung/sak/api/behandlinger/gjenoppta', UngdomsytelseBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/ung/sak/api/behandlinger/sett-pa-vent', UngdomsytelseBehandlingApiKeys.BEHANDLING_ON_HOLD)

  /* FPTILBAKE */
  .withPost(
    '/ung/tilbake/api/dokument/forhandsvis-varselbrev',
    UngdomsytelseBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
    { isResponseBlob: true },
  )

  /* K9FORMIDLING */
  .withPost('/ung/formidling/api/brev/forhaandsvis', UngdomsytelseBehandlingApiKeys.PREVIEW_MESSAGE, {
    isResponseBlob: true,
  })
  .withPost('/ung/formidling/api/brev/html', UngdomsytelseBehandlingApiKeys.HENT_FRITEKSTBREV_HTML)

  .build();

export const requestUngdomsytelseApi = createRequestApi(endpoints);

export const restApiUngdomsytelseHooks = RestApiHooks.initHooks(requestUngdomsytelseApi);
