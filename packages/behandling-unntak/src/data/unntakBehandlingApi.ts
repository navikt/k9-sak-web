import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum UnntakBehandlingApiKeys {
  BEHANDLING_UNNTAK = 'BEHANDLING_UNNTAK',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT = 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE = 'PREVIEW_TILBAKEKREVING_MESSAGE',
  STONADSKONTOER_GITT_UTTAKSPERIODER = 'STONADSKONTOER_GITT_UTTAKSPERIODER',
  AKSJONSPUNKTER = 'AKSJONSPUNKTER',
  VILKAR = 'VILKAR',
  PERSONOPPLYSNINGER = 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT = 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG = 'TILBAKEKREVINGVALG',
  BEREGNINGSRESULTAT_UTBETALING = 'BEREGNINGSRESULTAT_UTBETALING',
  FAMILIEHENDELSE = 'FAMILIEHENDELSE',
  SOKNAD = 'SOKNAD',
  SOKNAD_ORIGINAL_BEHANDLING = 'SOKNAD_ORIGINAL_BEHANDLING',
  FAMILIEHENDELSE_ORIGINAL_BEHANDLING = 'FAMILIEHENDELSE_ORIGINAL_BEHANDLING',
  MEDLEMSKAP = 'MEDLEMSKAP',
  VERGE = 'VERGE',
  OPPTJENING = 'OPPTJENING',
  SEND_VARSEL_OM_REVURDERING = 'SEND_VARSEL_OM_REVURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  VERGE_OPPRETT = 'VERGE_OPPRETT',
  VERGE_FJERN = 'VERGE_FJERN',
  VEDTAK_VARSEL = 'VEDTAK_VARSEL',
  FORBRUKTE_DAGER = 'FORBRUKTE_DAGER',
  INNTEKT_OG_YTELSER = 'INNTEKT_OG_YTELSER',
  TILGJENGELIGE_VEDTAKSBREV = 'TILGJENGELIGE_VEDTAKSBREV',
  DOKUMENTDATA_LAGRE = 'DOKUMENTDATA_LAGRE',
  DOKUMENTDATA_HENTE = 'DOKUMENTDATA_HENTE',
  HENT_FRITEKSTBREV_HTML = 'HENT_FRITEKSTBREV_HTML',
  ARBEIDSFORHOLD = 'ARBEIDSFORHOLD',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', UnntakBehandlingApiKeys.BEHANDLING_UNNTAK)

  .withRel('beregningsresultat-utbetalt', UnntakBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING) // behandlingsdata
  .withRel('aksjonspunkter', UnntakBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', UnntakBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', UnntakBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', UnntakBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', UnntakBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('familiehendelse-v2', UnntakBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', UnntakBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', UnntakBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', UnntakBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap-v2', UnntakBehandlingApiKeys.MEDLEMSKAP)
  .withRel('arbeidsforhold-v1', UnntakBehandlingApiKeys.ARBEIDSFORHOLD)
  .withRel('soeker-verge', UnntakBehandlingApiKeys.VERGE)
  .withRel('opptjening-v2', UnntakBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', UnntakBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('forbrukte-dager', UnntakBehandlingApiKeys.FORBRUKTE_DAGER)
  .withRel('inntekt', UnntakBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('tilgjengelige-vedtaksbrev', UnntakBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)

  // operasjoner
  .withRel('dokumentdata-lagre', UnntakBehandlingApiKeys.DOKUMENTDATA_LAGRE)
  .withRel('dokumentdata-hente', UnntakBehandlingApiKeys.DOKUMENTDATA_HENTE)

  // TODO Flytt alle endepunkter under til backend på same måte som i fp-frontend
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', UnntakBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', UnntakBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt/overstyr', UnntakBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    UnntakBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', UnntakBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', UnntakBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', UnntakBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', UnntakBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/verge/opprett', UnntakBehandlingApiKeys.VERGE_OPPRETT)
  .withPost('/k9/sak/api/verge/fjern', UnntakBehandlingApiKeys.VERGE_FJERN)

  /* FPTILBAKE */
  .withPost('/k9/tilbake/api/dokument/forhandsvis-varselbrev', UnntakBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE, {
    isResponseBlob: true,
  })

  /* K9FORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', UnntakBehandlingApiKeys.PREVIEW_MESSAGE, { isResponseBlob: true })
  .withPost('/k9/formidling/api/brev/html', UnntakBehandlingApiKeys.HENT_FRITEKSTBREV_HTML)

  .build();

export const requestUnntakApi = createRequestApi(endpoints);

export const restApiUnntakHooks = RestApiHooks.initHooks(requestUnntakApi);
