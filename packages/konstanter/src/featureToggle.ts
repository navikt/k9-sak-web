const featureMap = {
  'fpsak.aksjonspunkt-marker-utenlandssak': 'AKSJONSPUNKT_MARKER_UTENLANDSSAK',
  'k9sak.simuler-oppdrag-varseltekst': 'SIMULER_OPPDRAG_VARSELTEKST',
  'k9sak.aktiver-klagebehandling': 'AKTIVER_KLAGEBEHANDLING',
  'k9sak.frontend.uttak.aksjonspunkt': 'FRONTEND_UTTAK_AKSJONSPUNKT',
  'k9sak.aktiver-dokumentdata': 'AKTIVER_DOKUMENTDATA',
  'k9sak.aktiver-unntaksbehandling': 'AKTIVER_UNNTAKSBEHANDLING',
};

const featureToggle = {
  AKSJONSPUNKT_MARKER_UTENLANDSSAK: false,
  SIMULER_OPPDRAG_VARSELTEKST: false,
  AKTIVER_KLAGEBEHANDLING: false,
  FRONTEND_UTTAK_AKSJONSPUNKT: false,
  AKTIVER_DOKUMENTDATA: false,
  AKTIVER_UNNTAKSBEHANDLING: false,
};

if (process.env.FEATURE_TOGGLES) {
  process.env.FEATURE_TOGGLES.split(',').forEach(key => {
    const feature = featureMap[key.trim()];

    /* eslint-disable-next-line no-prototype-builtins */
    if (feature && featureToggle.hasOwnProperty(feature)) {
      featureToggle[feature] = true;
    }
  });
}

export default featureToggle;
