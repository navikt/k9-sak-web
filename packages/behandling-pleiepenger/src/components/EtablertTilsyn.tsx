import { findEndpointsFromRels } from '@fpsak-frontend/utils';
import { EtablertTilsynContainer } from '@k9-sak-web/fakta-etablert-tilsyn';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { use } from 'react';
import { lagEtablertTilsynAksjonspunktData, utledEtablertTilsynAksjonspunkt } from './etablertTilsynAksjonspunkt';

export default ({ aksjonspunkter, behandling, readOnly, submitCallback }) => {
  const { NATTEVAAK_BEREDSKAP_OVERSTYRING } = use(FeatureTogglesContext);

  const beredskap = utledEtablertTilsynAksjonspunkt(aksjonspunkter, 'BEREDSKAP', NATTEVAAK_BEREDSKAP_OVERSTYRING);
  const løsBeredskapAksjonspunkt = data =>
    submitCallback([lagEtablertTilsynAksjonspunktData(beredskap, 'Beredskap er behandlet', data)]);

  const nattevåk = utledEtablertTilsynAksjonspunkt(aksjonspunkter, 'NATTEVÅK', NATTEVAAK_BEREDSKAP_OVERSTYRING);
  const løsNattevåkAksjonspunkt = data =>
    submitCallback([lagEtablertTilsynAksjonspunktData(nattevåk, 'Nattevåk er behandlet', data)]);

  return (
    <EtablertTilsynContainer
      data={{
        readOnly,
        endpoints: findEndpointsFromRels(behandling.links, [
          { rel: 'pleiepenger-sykt-barn-tilsyn', desiredName: 'tilsyn' },
          { rel: 'sykdom-vurdering-oversikt-ktp', desiredName: 'sykdom' },
          { rel: 'sykdom-innleggelse', desiredName: 'sykdomInnleggelse' },
        ]),
        lagreBeredskapvurdering: løsBeredskapAksjonspunkt,
        lagreNattevåkvurdering: løsNattevåkAksjonspunkt,
        harUløstAksjonspunktForBeredskap: beredskap.harUløstAksjonspunkt,
        harUløstAksjonspunktForNattevåk: nattevåk.harUløstAksjonspunkt,
        harLøstAksjonspunktForBeredskap: beredskap.harLøstAksjonspunkt,
        harLøstAksjonspunktForNattevåk: nattevåk.harLøstAksjonspunkt,
        kanRedigereBeredskap: beredskap.kanRedigere,
        kanRedigereNattevåk: nattevåk.kanRedigere,
      }}
    />
  );
};
