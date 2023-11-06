require('dotenv').config();

const featureToggles = [
  {
    key: 'KLAGE_KABAL',
    value: process.env.KLAGE_KABAL,
  },
  {
    key: 'VARSELTEKST',
    value: process.env.VARSELTEKST,
  },
  {
    key: 'DOKUMENTDATA',
    value: process.env.DOKUMENTDATA,
  },
  {
    key: 'UNNTAKSBEHANDLING',
    value: process.env.UNNTAKSBEHANDLING,
  },
  {
    key: 'UTENLANDSOPPHOLD',
    value: process.env.UTENLANDSOPPHOLD,
  },
  {
    key: 'SOKNADPERIODESTRIPE',
    value: process.env.SOKNADPERIODESTRIPE,
  },
  {
    key: 'TYPE_MEDISINSKE_OPPLYSNINGER_BREV',
    value: process.env.TYPE_MEDISINSKE_OPPLYSNINGER_BREV,
  },
  {
    key: 'LOS_MARKER_BEHANDLING',
    value: process.env.LOS_MARKER_BEHANDLING,
  },
  {
    key: 'LOS_MARKER_BEHANDLING_SUBMIT',
    value: process.env.LOS_MARKER_BEHANDLING_SUBMIT,
  },
  {
    key: 'AKSJONSPUNKT_9014',
    value: process.env.AKSJONSPUNKT_9014,
  },
  {
    key: 'AKSJONSPUNKT_9015',
    value: process.env.AKSJONSPUNKT_9015,
  },
  {
    key: 'FRITEKST_REDIGERING',
    value: process.env.FRITEKST_REDIGERING,
  },
  {
    key: 'SKJUL_AVSLUTTET_ARBEIDSGIVER',
    value: process.env.SKJUL_AVSLUTTET_ARBEIDSGIVER,
  },
  {
    key: 'OMS_PUNSJSTRIPE',
    value: process.env.OMS_PUNSJSTRIPE,
  },
  {
    key: 'OMSORGEN_FOR_PERIODISERT',
    value: process.env.OMSORGEN_FOR_PERIODISERT,
  },
  {
    key: 'OVERSTYR_BEREGNING',
    value: process.env.OVERSTYR_BEREGNING,
  },
  {
    key: 'FAKTA_BEREGNING_REDESIGN',
    value: process.env.FAKTA_BEREGNING_REDESIGN,
  },
  {
    key: 'NOTAT_I_SAK',
    value: process.env.NOTAT_I_SAK,
  },
];

module.exports = function (app) {
  app.all('/k9/feature-toggle/toggles.json', function (req, res) {
    res.json(featureToggles);
  });
};
