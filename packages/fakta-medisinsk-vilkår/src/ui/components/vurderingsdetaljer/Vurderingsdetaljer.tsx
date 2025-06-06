import React, { type JSX } from 'react';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
// eslint-disable-next-line max-len
import VurderingsdetaljvisningForEksisterendeVurdering from '../vurderingsdetaljvisning-for-eksisterende-vurdering/VurderingsdetaljvisningForEksisterendeVurdering';
import VurderingsdetaljvisningForNyVurdering from '../vurderingsdetaljvisning-for-ny-vurdering/VurderingsdetaljvisningForNyVurdering';

interface VurderingsdetaljerProps {
  valgtVurderingselement: Vurderingselement | null;
  vurderingsoversikt: Vurderingsoversikt;
  onVurderingLagret: () => Promise<void>;
  onAvbryt: () => void;
  radForNyVurderingVises: boolean;
  nyVurderingFormVises: boolean;
}

const Vurderingsdetaljer = ({
  valgtVurderingselement,
  vurderingsoversikt,
  onVurderingLagret,
  onAvbryt,
  radForNyVurderingVises,
  nyVurderingFormVises,
}: VurderingsdetaljerProps): JSX.Element => {
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    setEditMode(false);
  }, [valgtVurderingselement]);

  const onVurderingLagretCallback = async () => {
    setEditMode(false);
    await onVurderingLagret();
  };

  let valgtVurderingContent = <></>;
  if (valgtVurderingselement) {
    valgtVurderingContent = (
      <VurderingsdetaljvisningForEksisterendeVurdering
        vurderingsoversikt={vurderingsoversikt}
        vurderingselement={valgtVurderingselement}
        editMode={editMode}
        onEditClick={() => setEditMode(true)}
        onAvbrytClick={() => setEditMode(false)}
        onVurderingLagret={onVurderingLagretCallback}
      />
    );
  }

  const harValgtVurderingselement = !!valgtVurderingselement;
  return (
    <>
      {harValgtVurderingselement && valgtVurderingContent}
      <div style={{ display: harValgtVurderingselement || !nyVurderingFormVises ? 'none' : '' }}>
        <VurderingsdetaljvisningForNyVurdering
          vurderingsoversikt={vurderingsoversikt}
          radForNyVurderingVises={radForNyVurderingVises}
          onAvbryt={onAvbryt}
          onVurderingLagret={onVurderingLagret}
        />
      </div>
    </>
  );
};

export default Vurderingsdetaljer;
