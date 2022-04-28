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
];

module.exports = function (app) {
  app.all('/k9/feature-toggle/toggles.json', function (req, res) {
    res.json(featureToggles);
  });
};
