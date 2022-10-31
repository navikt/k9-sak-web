import React, { useState } from 'react';
import { Button } from '@navikt/ds-react';
import MenyMarkerBehandling from '@k9-sak-web/sak-meny-marker-behandling';
import { MerknadFraLos, FeatureToggles } from '@k9-sak-web/types';

interface VeiledervisningProps {
  behandlingUuid: string;
  featureToggles: FeatureToggles;
  markerBehandling: (values: any) => Promise<any>;
  merknaderFraLos: MerknadFraLos;
}

const BehandlingMenuVeiledervisning: React.FC<VeiledervisningProps> = ({
  behandlingUuid,
  featureToggles,
  markerBehandling,
  merknaderFraLos,
}) => {
  const [visMarkerBehandlingModal, setVisMarkerBehandlingModal] = useState(false);

  if (!featureToggles?.LOS_MARKER_BEHANDLING) {
    return null;
  }

  return (
    <>
      <Button size="small" variant="secondary" onClick={() => setVisMarkerBehandlingModal(!visMarkerBehandlingModal)}>
        Marker behandling
      </Button>
      {visMarkerBehandlingModal && (
        <MenyMarkerBehandling
          behandlingUuid={behandlingUuid}
          markerBehandling={markerBehandling}
          lukkModal={() => setVisMarkerBehandlingModal(!visMarkerBehandlingModal)}
          brukHastekøMarkering
          merknaderFraLos={merknaderFraLos}
          erVeileder
        />
      )}
    </>
  );
};

export default BehandlingMenuVeiledervisning;
