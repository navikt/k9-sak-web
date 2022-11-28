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
    key: 'AKSJONSPUNKT_9014',
    value: process.env.AKSJONSPUNKT_9014,
  },
  {
    key: 'AKSJONSPUNKT_9015',
    value: process.env.AKSJONSPUNKT_9015,
  },
  {
    key: 'NY_PROSESS_VEDTAK_ENABLED',
    value: process.env.NY_PROSESS_VEDTAK_ENABLED,
  },
  {
    key: 'FRITEKST_REDIGERING',
    value: process.env.FRITEKST_REDIGERING,
  },
];

module.exports = function (app) {
  app.all('/k9/feature-toggle/toggles.json', function (req, res) {
    res.json(featureToggles);
  });
};
