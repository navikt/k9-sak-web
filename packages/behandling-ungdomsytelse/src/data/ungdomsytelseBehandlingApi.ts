import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum UngdomsytelseBehandlingApiKeys {
  BEHANDLING_PP = 'BEHANDLING_PP',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT = 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE = 'PREVIEW_TILBAKEKREVING_MESSAGE',
  HENT_FRITEKSTBREV_HTML = 'HENT_FRITEKSTBREV_HTML',
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
  UTTAK_PERIODE_GRENSE = 'UTTAK_PERIODE_GRENSE',
  VERGE = 'VERGE',
  OPPTJENING = 'OPPTJENING',
  SEND_VARSEL_OM_REVURDERING = 'SEND_VARSEL_OM_REVURDERING',
  FAKTA_ARBEIDSFORHOLD = 'FAKTA_ARBEIDSFORHOLD',
  UTTAKSRESULTAT_PERIODER = 'UTTAKSRESULTAT_PERIODER',
  UTTAK_STONADSKONTOER = 'UTTAK_STONADSKONTOER',
  UTTAK_KONTROLLER_FAKTA_PERIODER = 'UTTAK_KONTROLLER_FAKTA_PERIODER',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  VERGE_OPPRETT = 'VERGE_OPPRETT',
  VERGE_FJERN = 'VERGE_FJERN',
  SYKDOM = 'SYKDOM',
  TILGJENGELIGE_VEDTAKSBREV = 'TILGJENGELIGE_VEDTAKSBREV',
  INFORMASJONSBEHOV_VEDTAKSBREV = 'INFORMASJONSBEHOV_VEDTAKSBREV',
  DOKUMENTDATA_LAGRE = 'DOKUMENTDATA_LAGRE',
  DOKUMENTDATA_HENTE = 'DOKUMENTDATA_HENTE',
  ARBEIDSFORHOLD = 'ARBEIDSFORHOLD',
  UTTAK = 'UTTAK',
  FRITEKSTDOKUMENTER = 'FRITEKSTDOKUMENTER',
  INNTEKT_OG_YTELSER = 'INNTEKT_OG_YTELSER',
  OVERSTYR_INPUT_BEREGNING = 'OVERSTYR_INPUT_BEREGNING',
  OVERLAPPENDE_YTELSER = 'OVERLAPPENDE_YTELSER',
  UTENLANDSOPPHOLD = 'UTENLANDSOPPHOLD',
  BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR = 'BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR',
  BEREGNINGREFERANSER_TIL_VURDERING = 'BEREGNINGREFERANSER_TIL_VURDERING',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', UngdomsytelseBehandlingApiKeys.BEHANDLING_PP)

  // behandlingsdata
  .withRel('beregningsresultat-utbetalt', UngdomsytelseBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING)
  .withRel('aksjonspunkter', UngdomsytelseBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', UngdomsytelseBehandlingApiKeys.VILKAR)
  .withRel('soknadsfrist-status', UngdomsytelseBehandlingApiKeys.SOKNADSFRIST_STATUS)
  .withRel('soeker-personopplysninger', UngdomsytelseBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', UngdomsytelseBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', UngdomsytelseBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag-alle', UngdomsytelseBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('familiehendelse-v2', UngdomsytelseBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', UngdomsytelseBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', UngdomsytelseBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', UngdomsytelseBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap-v2', UngdomsytelseBehandlingApiKeys.MEDLEMSKAP)
  .withRel('uttak-periode-grense', UngdomsytelseBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withRel('arbeidsforhold-v1', UngdomsytelseBehandlingApiKeys.ARBEIDSFORHOLD)
  .withRel('soeker-verge', UngdomsytelseBehandlingApiKeys.VERGE)
  .withRel('opptjening-v2', UngdomsytelseBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', UngdomsytelseBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('fakta-arbeidsforhold', UngdomsytelseBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withRel('uttaksresultat-perioder', UngdomsytelseBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withRel('uttak-stonadskontoer', UngdomsytelseBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withRel('uttak-kontroller-fakta-perioder', UngdomsytelseBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('sykdom', UngdomsytelseBehandlingApiKeys.SYKDOM)
  .withRel('tilgjengelige-vedtaksbrev', UngdomsytelseBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)
  .withRel('informasjonsbehov-vedtaksbrev', UngdomsytelseBehandlingApiKeys.INFORMASJONSBEHOV_VEDTAKSBREV)
  .withRel('pleiepenger-uttaksplan-med-utsatt', UngdomsytelseBehandlingApiKeys.UTTAK)
  .withRel('pleiepenger-fritekstdokumenter', UngdomsytelseBehandlingApiKeys.FRITEKSTDOKUMENTER)
  .withRel('inntekt', UngdomsytelseBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('overstyr-input-beregning', UngdomsytelseBehandlingApiKeys.OVERSTYR_INPUT_BEREGNING)
  .withRel('overlappende-ytelser', UngdomsytelseBehandlingApiKeys.OVERLAPPENDE_YTELSER)
  .withRel('utenlandsopphold', UngdomsytelseBehandlingApiKeys.UTENLANDSOPPHOLD)
  .withRel('behandling-perioder-årsak-med-vilkår', UngdomsytelseBehandlingApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR)
  .withRel('beregning-koblinger-til-vurdering', UngdomsytelseBehandlingApiKeys.BEREGNINGREFERANSER_TIL_VURDERING)

  // operasjoner
  .withRel('dokumentdata-lagre', UngdomsytelseBehandlingApiKeys.DOKUMENTDATA_LAGRE)
  .withRel('dokumentdata-hente', UngdomsytelseBehandlingApiKeys.DOKUMENTDATA_HENTE)

  // TODO Flytt alle endepunkter under til backend på same måte som i fp-frontend
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', UngdomsytelseBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', UngdomsytelseBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost(
    '/k9/sak/api/behandling/aksjonspunkt/overstyr',
    UngdomsytelseBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
  )
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    UngdomsytelseBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', UngdomsytelseBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', UngdomsytelseBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', UngdomsytelseBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', UngdomsytelseBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/verge/opprett', UngdomsytelseBehandlingApiKeys.VERGE_OPPRETT)
  .withPost('/k9/sak/api/verge/fjern', UngdomsytelseBehandlingApiKeys.VERGE_FJERN)

  /* FPTILBAKE */
  .withPost(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    UngdomsytelseBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
    { isResponseBlob: true },
  )

  /* K9FORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', UngdomsytelseBehandlingApiKeys.PREVIEW_MESSAGE, {
    isResponseBlob: true,
  })
  .withPost('/k9/formidling/api/brev/html', UngdomsytelseBehandlingApiKeys.HENT_FRITEKSTBREV_HTML)

  .build();

export const requestUngdomsytelseApi = createRequestApi(endpoints);

export const restApiUngdomsytelseHooks = RestApiHooks.initHooks(requestUngdomsytelseApi);
