require('dotenv').config();

const toggles = {
  featureToggles: {
    'fpsak.aksjonspunkt-marker-utenlandssak': false,
    'k9sak.simuler-oppdrag-varseltekst': false,
    'k9sak.aktiver-tilbakekrevingbehandling': false,
    'k9sak.aktiver-klagebehandling': true,
    'k9sak.frontend.uttak.aksjonspunkt': false,
    'k9sak.aktiver-dokumentdata': false,
  },
};
if (process.env.FEATURE_TOGGLES) {
  process.env.FEATURE_TOGGLES.split(',').forEach(key => {
    toggles.featureToggles[key.trim()] = true;
  });
}
module.exports = function (app) {
  app.all('/k9/sak/api/feature-toggle', function (req, res) {
    res.json(toggles);
  });
};
