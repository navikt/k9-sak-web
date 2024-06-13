// This must be a "factory" function so that the values are not resoved too early in dev server startup, before vite
// has resolved the env variables.
export const featureTogglesFactory = () => [
  {
    key: 'BRUK_V2_MELDINGER',
    value: process.env.VITE_BRUK_V2_MELDINGER,
  },
  {
    key: 'KLAGE_KABAL',
    value: process.env.VITE_KLAGE_KABAL,
  },
  {
    key: 'VARSELTEKST',
    value: process.env.VITE_VARSELTEKST,
  },
  {
    key: 'DOKUMENTDATA',
    value: process.env.VITE_DOKUMENTDATA,
  },
  {
    key: 'UNNTAKSBEHANDLING',
    value: process.env.VITE_UNNTAKSBEHANDLING,
  },
  {
    key: 'SOKNADPERIODESTRIPE',
    value: process.env.VITE_SOKNADPERIODESTRIPE,
  },
  {
    key: 'TYPE_MEDISINSKE_OPPLYSNINGER_BREV',
    value: process.env.VITE_TYPE_MEDISINSKE_OPPLYSNINGER_BREV,
  },
  {
    key: 'LOS_MARKER_BEHANDLING',
    value: process.env.VITE_LOS_MARKER_BEHANDLING,
  },
  {
    key: 'LOS_MARKER_BEHANDLING_SUBMIT',
    value: process.env.VITE_LOS_MARKER_BEHANDLING_SUBMIT,
  },
  {
    key: 'AKSJONSPUNKT_9014',
    value: process.env.VITE_AKSJONSPUNKT_9014,
  },
  {
    key: 'AKSJONSPUNKT_9015',
    value: process.env.VITE_AKSJONSPUNKT_9015,
  },
  {
    key: 'FRITEKST_REDIGERING',
    value: process.env.VITE_FRITEKST_REDIGERING,
  },
  {
    key: 'SKJUL_AVSLUTTET_ARBEIDSGIVER',
    value: process.env.VITE_SKJUL_AVSLUTTET_ARBEIDSGIVER,
  },
  {
    key: 'OMS_PUNSJSTRIPE',
    value: process.env.VITE_OMS_PUNSJSTRIPE,
  },
  {
    key: 'OMSORGEN_FOR_PERIODISERT',
    value: process.env.VITE_OMSORGEN_FOR_PERIODISERT,
  },
  {
    key: 'OVERSTYR_BEREGNING',
    value: process.env.VITE_OVERSTYR_BEREGNING,
  },
  {
    key: 'OVERSTYRING_UTTAK',
    value: process.env.VITE_OVERSTYRING_UTTAK,
  },
  {
    key: 'VITE_AVSLAGSÅRSAK_ALENEOMSORG',
    value: process.env.VITE_AVSLAGSÅRSAK_ALENEOMSORG
  },
];
