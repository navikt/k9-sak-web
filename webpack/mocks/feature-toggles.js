require('dotenv').config();

const featureToggles = [
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
    key: 'KLAGEBEHANDLING',
    value: process.env.KLAGEBEHANDLING,
  },
  {
    key: 'TILBAKE',
    value: process.env.TILBAKE,
  },
  {
    key: 'PERIODISERTE_NOKKELTALL',
    value: process.env.PERIODISERTE_NOKKELTALL,
  },
];

module.exports = function (app) {
  app.all('/k9/feature-toggle/toggles.json', function (req, res) {
    res.json(featureToggles);
  });
};
