import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import MenyMarkerBehandlingV2 from '@k9-sak-web/gui/sak/meny/marker-behandling/MenyMarkerBehandling.js';
import { Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';

interface VeiledervisningProps {
  behandlingUuid: string;
}

const BehandlingMenuVeiledervisning: React.FC<VeiledervisningProps> = ({ behandlingUuid }) => {
  const [visMarkerBehandlingModal, setVisMarkerBehandlingModal] = useState(false);
  const featureToggles = useContext(FeatureTogglesContext);
  if (!featureToggles?.LOS_MARKER_BEHANDLING) {
    return null;
  }

  return (
    <>
      <Button size="small" variant="secondary" onClick={() => setVisMarkerBehandlingModal(!visMarkerBehandlingModal)}>
        Marker behandling
      </Button>
      {visMarkerBehandlingModal && (
        <MenyMarkerBehandlingV2
          behandlingUuid={behandlingUuid}
          lukkModal={() => setVisMarkerBehandlingModal(!visMarkerBehandlingModal)}
          erVeileder
        />
      )}
    </>
  );
};

export default BehandlingMenuVeiledervisning;
