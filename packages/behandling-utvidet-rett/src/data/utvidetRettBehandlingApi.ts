import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum UtvidetRettBehandlingApiKeys {
  BEHANDLING_OMSORG = 'BEHANDLING_OMSORG',
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
  BEREGNINGSGRUNNLAG = 'BEREGNINGSGRUNNLAG',
  FAMILIEHENDELSE = 'FAMILIEHENDELSE',
  SOKNAD = 'SOKNAD',
  SOKNAD_ORIGINAL_BEHANDLING = 'SOKNAD_ORIGINAL_BEHANDLING',
  FAMILIEHENDELSE_ORIGINAL_BEHANDLING = 'FAMILIEHENDELSE_ORIGINAL_BEHANDLING',
  MEDLEMSKAP = 'MEDLEMSKAP',
  INNTEKT_ARBEID_YTELSE = 'INNTEKT_ARBEID_YTELSE',
  VERGE = 'VERGE',
  OPPTJENING = 'OPPTJENING',
  SEND_VARSEL_OM_REVURDERING = 'SEND_VARSEL_OM_REVURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  OPEN_BEHANDLING_FOR_CHANGES = 'OPEN_BEHANDLING_FOR_CHANGES',
  VERGE_OPPRETT = 'VERGE_OPPRETT',
  VERGE_FJERN = 'VERGE_FJERN',
  VEDTAK_VARSEL = 'VEDTAK_VARSEL',
  FORBRUKTE_DAGER = 'FORBRUKTE_DAGER',
  FULL_UTTAKSPLAN = 'FULL_UTTAKSPLAN',
  INNTEKT_OG_YTELSER = 'INNTEKT_OG_YTELSER',
  TILGJENGELIGE_VEDTAKSBREV = 'TILGJENGELIGE_VEDTAKSBREV',
  DOKUMENTDATA_LAGRE = 'DOKUMENTDATA_LAGRE',
  DOKUMENTDATA_HENTE = 'DOKUMENTDATA_HENTE',
  ARBEIDSFORHOLD = 'ARBEIDSFORHOLD',
  OMSORGEN_FOR = 'OMSORGEN_FOR',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', UtvidetRettBehandlingApiKeys.BEHANDLING_OMSORG)

  // behandlingsdata
  .withRel('beregningsresultat-utbetalt', UtvidetRettBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING)
  .withRel('aksjonspunkter', UtvidetRettBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', UtvidetRettBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', UtvidetRettBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', UtvidetRettBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', UtvidetRettBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag-alle', UtvidetRettBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('familiehendelse-v2', UtvidetRettBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', UtvidetRettBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', UtvidetRettBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', UtvidetRettBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap-v2', UtvidetRettBehandlingApiKeys.MEDLEMSKAP)
  .withRel('inntekt-arbeid-ytelse', UtvidetRettBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withRel('arbeidsforhold-v1', UtvidetRettBehandlingApiKeys.ARBEIDSFORHOLD)
  .withRel('soeker-verge', UtvidetRettBehandlingApiKeys.VERGE)
  .withRel('opptjening-v2', UtvidetRettBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', UtvidetRettBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('vedtak-varsel', UtvidetRettBehandlingApiKeys.VEDTAK_VARSEL)
  .withRel('forbrukte-dager', UtvidetRettBehandlingApiKeys.FORBRUKTE_DAGER)
  .withRel('full-uttaksplan', UtvidetRettBehandlingApiKeys.FULL_UTTAKSPLAN)
  .withRel('inntekt', UtvidetRettBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('tilgjengelige-vedtaksbrev', UtvidetRettBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)
  .withRel('omsorgen-for', UtvidetRettBehandlingApiKeys.OMSORGEN_FOR)

  // operasjoner
  .withRel('dokumentdata-lagre', UtvidetRettBehandlingApiKeys.DOKUMENTDATA_LAGRE)
  .withRel('dokumentdata-hente', UtvidetRettBehandlingApiKeys.DOKUMENTDATA_HENTE)

  // TODO Flytt alle endepunkter under til backend på same måte som i fp-frontend
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', UtvidetRettBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', UtvidetRettBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost(
    '/k9/sak/api/behandling/aksjonspunkt/overstyr',
    UtvidetRettBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
  )
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    UtvidetRettBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', UtvidetRettBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', UtvidetRettBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', UtvidetRettBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', UtvidetRettBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/opne-for-endringer', UtvidetRettBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES)
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
