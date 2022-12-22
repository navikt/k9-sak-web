import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum OpplaeringspengerBehandlingApiKeys {
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
  HENT_SAKSBEHANDLERE = 'HENT_SAKSBEHANDLERE',
  UTENLANDSOPPHOLD = 'UTENLANDSOPPHOLD',
  BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR = 'BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR',
  BEREGNINGREFERANSER_TIL_VURDERING = 'BEREGNINGREFERANSER_TIL_VURDERING',
  INSTITUSJON = 'INSTITUSJON',
  GJENNOMGÅTT_OPPLÆRING = 'GJENNOMGÅTT_OPPLÆRING',
  NØDVENDIG_OPPLÆRING = 'NØDVENDIG_OPPLÆRING',
  REISETID = 'REISETID',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', OpplaeringspengerBehandlingApiKeys.BEHANDLING_PP)

  // behandlingsdata
  .withRel('beregningsresultat-utbetalt', OpplaeringspengerBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING)
  .withRel('aksjonspunkter', OpplaeringspengerBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', OpplaeringspengerBehandlingApiKeys.VILKAR)
  .withRel('soknadsfrist-status', OpplaeringspengerBehandlingApiKeys.SOKNADSFRIST_STATUS)
  .withRel('soeker-personopplysninger', OpplaeringspengerBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', OpplaeringspengerBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', OpplaeringspengerBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag-alle', OpplaeringspengerBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('familiehendelse-v2', OpplaeringspengerBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', OpplaeringspengerBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', OpplaeringspengerBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel(
    'familiehendelse-original-behandling',
    OpplaeringspengerBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
  )
  .withRel('soeker-medlemskap-v2', OpplaeringspengerBehandlingApiKeys.MEDLEMSKAP)
  .withRel('uttak-periode-grense', OpplaeringspengerBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withRel('arbeidsforhold-v1', OpplaeringspengerBehandlingApiKeys.ARBEIDSFORHOLD)
  .withRel('soeker-verge', OpplaeringspengerBehandlingApiKeys.VERGE)
  .withRel('opptjening-v2', OpplaeringspengerBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', OpplaeringspengerBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('fakta-arbeidsforhold', OpplaeringspengerBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withRel('uttaksresultat-perioder', OpplaeringspengerBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withRel('uttak-stonadskontoer', OpplaeringspengerBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withRel('uttak-kontroller-fakta-perioder', OpplaeringspengerBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('sykdom', OpplaeringspengerBehandlingApiKeys.SYKDOM)
  .withRel('tilgjengelige-vedtaksbrev', OpplaeringspengerBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)
  .withRel('informasjonsbehov-vedtaksbrev', OpplaeringspengerBehandlingApiKeys.INFORMASJONSBEHOV_VEDTAKSBREV)
  .withRel('opplaeringspenger-uttaksplan-med-utsatt', OpplaeringspengerBehandlingApiKeys.UTTAK)
  .withRel('opplaeringspenger-fritekstdokumenter', OpplaeringspengerBehandlingApiKeys.FRITEKSTDOKUMENTER)
  .withRel('inntekt', OpplaeringspengerBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('overstyr-input-beregning', OpplaeringspengerBehandlingApiKeys.OVERSTYR_INPUT_BEREGNING)
  .withRel('overlappende-ytelser', OpplaeringspengerBehandlingApiKeys.OVERLAPPENDE_YTELSER)
  .withRel('saksbehandler-info', OpplaeringspengerBehandlingApiKeys.HENT_SAKSBEHANDLERE)
  .withRel('utenlandsopphold', OpplaeringspengerBehandlingApiKeys.UTENLANDSOPPHOLD)
  .withRel(
    'behandling-perioder-årsak-med-vilkår',
    OpplaeringspengerBehandlingApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR,
  )
  .withRel('beregning-koblinger-til-vurdering', OpplaeringspengerBehandlingApiKeys.BEREGNINGREFERANSER_TIL_VURDERING)
  .withRel('institusjon', OpplaeringspengerBehandlingApiKeys.INSTITUSJON)
  .withRel('gjennomgått-opplæring', OpplaeringspengerBehandlingApiKeys.GJENNOMGÅTT_OPPLÆRING)
  .withRel('nødvendig-opplæring', OpplaeringspengerBehandlingApiKeys.NØDVENDIG_OPPLÆRING)
  .withRel('reisetid', OpplaeringspengerBehandlingApiKeys.REISETID)

  // operasjoner
  .withRel('dokumentdata-lagre', OpplaeringspengerBehandlingApiKeys.DOKUMENTDATA_LAGRE)
  .withRel('dokumentdata-hente', OpplaeringspengerBehandlingApiKeys.DOKUMENTDATA_HENTE)

  // TODO Flytt alle endepunkter under til backend på same måte som i fp-frontend
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', OpplaeringspengerBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', OpplaeringspengerBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost(
    '/k9/sak/api/behandling/aksjonspunkt/overstyr',
    OpplaeringspengerBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
  )
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    OpplaeringspengerBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', OpplaeringspengerBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', OpplaeringspengerBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', OpplaeringspengerBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', OpplaeringspengerBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/verge/opprett', OpplaeringspengerBehandlingApiKeys.VERGE_OPPRETT)
  .withPost('/k9/sak/api/verge/fjern', OpplaeringspengerBehandlingApiKeys.VERGE_FJERN)

  /* FPTILBAKE */
  .withPost(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    OpplaeringspengerBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
    { isResponseBlob: true },
  )

  /* K9FORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', OpplaeringspengerBehandlingApiKeys.PREVIEW_MESSAGE, {
    isResponseBlob: true,
  })
  .withPost('/k9/formidling/api/brev/html', OpplaeringspengerBehandlingApiKeys.HENT_FRITEKSTBREV_HTML)

  .build();

export const requestOpplaeringspengerApi = createRequestApi(endpoints);

export const restApiOpplaeringspengerHooks = RestApiHooks.initHooks(requestOpplaeringspengerApi);
