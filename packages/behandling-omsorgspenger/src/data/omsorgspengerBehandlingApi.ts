import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum OmsorgspengerBehandlingApiKeys {
  BEHANDLING_OMSORG = 'BEHANDLING_OMSORG',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT = 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE = 'PREVIEW_TILBAKEKREVING_MESSAGE',
  STONADSKONTOER_GITT_UTTAKSPERIODER = 'STONADSKONTOER_GITT_UTTAKSPERIODER',
  AKSJONSPUNKTER = 'AKSJONSPUNKTER',
  VILKAR = 'VILKAR',
  SOKNADSFRIST_STATUS = 'SOKNADSFRIST_STATUS',
  PERSONOPPLYSNINGER = 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT = 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG = 'TILBAKEKREVINGVALG',
  BEREGNINGSRESULTAT_UTBETALING = 'BEREGNINGSRESULTAT_UTBETALING',
  BEREGNINGSGRUNNLAG = 'BEREGNINGSGRUNNLAG',
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
  FORBRUKTE_DAGER = 'FORBRUKTE_DAGER',
  FULL_UTTAKSPLAN = 'FULL_UTTAKSPLAN',
  INNTEKT_OG_YTELSER = 'INNTEKT_OG_YTELSER',
  TILGJENGELIGE_VEDTAKSBREV = 'TILGJENGELIGE_VEDTAKSBREV',
  DOKUMENTDATA_LAGRE = 'DOKUMENTDATA_LAGRE',
  DOKUMENTDATA_HENTE = 'DOKUMENTDATA_HENTE',
  ARBEIDSFORHOLD = 'ARBEIDSFORHOLD',
  OVERLAPPENDE_YTELSER = 'OVERLAPPENDE_YTELSER',
  HENT_SAKSBEHANDLERE = 'HENT_SAKSBEHANDLERE',
  FOSTERBARN = 'FOSTERBARN',
  BEREGNINGREFERANSER_TIL_VURDERING = 'BEREGNINGREFERANSER_TIL_VURDERING',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', OmsorgspengerBehandlingApiKeys.BEHANDLING_OMSORG)

  // behandlingsdata
  .withRel('beregningsresultat-utbetalt', OmsorgspengerBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING)
  .withRel('aksjonspunkter', OmsorgspengerBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', OmsorgspengerBehandlingApiKeys.VILKAR)
  .withRel('soknadsfrist-status', OmsorgspengerBehandlingApiKeys.SOKNADSFRIST_STATUS)
  .withRel('soeker-personopplysninger', OmsorgspengerBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', OmsorgspengerBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', OmsorgspengerBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag-alle', OmsorgspengerBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('familiehendelse-v2', OmsorgspengerBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', OmsorgspengerBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', OmsorgspengerBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', OmsorgspengerBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap-v2', OmsorgspengerBehandlingApiKeys.MEDLEMSKAP)
  .withRel('arbeidsforhold-v1', OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD)
  .withRel('soeker-verge', OmsorgspengerBehandlingApiKeys.VERGE)
  .withRel('opptjening-v2', OmsorgspengerBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', OmsorgspengerBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('forbrukte-dager', OmsorgspengerBehandlingApiKeys.FORBRUKTE_DAGER)
  .withRel('full-uttaksplan', OmsorgspengerBehandlingApiKeys.FULL_UTTAKSPLAN)
  .withRel('inntekt', OmsorgspengerBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('tilgjengelige-vedtaksbrev', OmsorgspengerBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)
  .withRel('overlappende-ytelser', OmsorgspengerBehandlingApiKeys.OVERLAPPENDE_YTELSER)
  .withRel('saksbehandler-info', OmsorgspengerBehandlingApiKeys.HENT_SAKSBEHANDLERE)
  .withRel('fosterbarn', OmsorgspengerBehandlingApiKeys.FOSTERBARN)
  .withRel('beregning-koblinger-til-vurdering', OmsorgspengerBehandlingApiKeys.BEREGNINGREFERANSER_TIL_VURDERING)

  // operasjoner
  .withRel('dokumentdata-lagre', OmsorgspengerBehandlingApiKeys.DOKUMENTDATA_LAGRE)
  .withRel('dokumentdata-hente', OmsorgspengerBehandlingApiKeys.DOKUMENTDATA_HENTE)

  // TODO Flytt alle endepunkter under til backend på same måte som i fp-frontend
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', OmsorgspengerBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', OmsorgspengerBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost(
    '/k9/sak/api/behandling/aksjonspunkt/overstyr',
    OmsorgspengerBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
  )
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    OmsorgspengerBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', OmsorgspengerBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', OmsorgspengerBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', OmsorgspengerBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', OmsorgspengerBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/verge/opprett', OmsorgspengerBehandlingApiKeys.VERGE_OPPRETT)
  .withPost('/k9/sak/api/verge/fjern', OmsorgspengerBehandlingApiKeys.VERGE_FJERN)

  /* FPTILBAKE */
  .withPost(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    OmsorgspengerBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
    { isResponseBlob: true },
  )

  /* K9FORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', OmsorgspengerBehandlingApiKeys.PREVIEW_MESSAGE, {
    isResponseBlob: true,
  })

  .build();

export const requestOmsorgApi = createRequestApi(endpoints);

export const restApiOmsorgHooks = RestApiHooks.initHooks(requestOmsorgApi);
