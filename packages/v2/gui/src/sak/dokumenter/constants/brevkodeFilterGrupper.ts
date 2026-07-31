export const brevkoder = {
  INNTEKTSMELDING: ['4936', 'INNTEKTSMELDING'],

  SØKNAD: [
    'PLEIEPENGER_SOKNAD',
    'PLEIEPENGER_LIVETS_SLUTTFASE_SOKNAD',
    'OPPLÆRINGSPENGER_SOKNAD',
    'SØKNAD_UTBETALING_OMS',
    'SØKNAD_UTBETALING_OMS_AT',
    'PAPIRSØKNAD_UTBETALING_OMS_AT',
    'SØKNAD_OMS_UTVIDETRETT_KS',
    'SØKNAD_OMS_UTVIDETRETT_MA',
    'SØKNAD_OMS_UTVIDETRETT_AO',
    'UNGDOMSYTELSE_SOKNAD',
    'INNTEKTKOMP_FRILANS',
    'FRAVÆRSKORRIGERING_IM_OMS',
  ],

  ETTERSENDELSE: [
    'ETTERSENDELSE_PLEIEPENGER_SYKT_BARN',
    'ETTERSENDELSE_PLEIEPENGER_LIVETS_SLUTTFASE_KODE',
    'ETTERSENDELSE_UTBETALING_OMS',
    'ETTERSENDELSE_UTBETALING_OMS_AT',
    'ETTERSENDELSE_OMS_UTVIDETRETT_KS',
    'ETTERSENDELSE_OMS_UTVIDETRETT_MA',
    'ETTERSENDELSE_OMS_UTVIDETRETT_AO',
    'ETTERSENDELSE_OPPLÆRINGSPENGER',
  ],

  PUNSJ: ['K9_PUNSJ_INNSENDING'],
} as const;

/** Filtrer på dokumenttype (kan kombineres og kombineres med behandlingsfilter) */
export const dokumentTypeFilter = {
  INNTEKTSMELDINGER: 'INNTEKTSMELDINGER',
  SØKNADER: 'SØKNADER',
  ETTERSENDELSER: 'ETTERSENDELSER',
  PUNSJ: 'PUNSJ',
} as const;

export type DokumentTypeFilter = (typeof dokumentTypeFilter)[keyof typeof dokumentTypeFilter];

export const isDokumentTypeFilter = (value: string): value is DokumentTypeFilter =>
  (Object.values(dokumentTypeFilter) as string[]).includes(value);
