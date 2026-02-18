import * as React from 'react';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import BeredskapsperiodeVurderingsdetaljer from '../beredskapsperiode-vurderingsdetaljer/BeredskapsperiodeVurderingsdetaljer';
import VurderingAvBeredskapsperioderForm from '../vurdering-av-beredskapsperioder-form/VurderingAvBeredskapsperioderForm';
import Beskrivelse from '../../../../types/Beskrivelse';
import Vurderingsresultat from '../../../../types/Vurderingsresultat';

interface BeredskapsperiodeoversiktControllerProps {
  valgtPeriode: Vurderingsperiode;
  editMode: boolean;
  onEditClick: () => void;
  onCancelClick: () => void;
  beskrivelser: Beskrivelse[];
}

const BeredskapsperiodeoversiktController = ({
  valgtPeriode,
  editMode,
  onEditClick,
  onCancelClick,
  beskrivelser,
}: BeredskapsperiodeoversiktControllerProps) => {
  if (valgtPeriode.resultat !== Vurderingsresultat.IKKE_VURDERT && !editMode) {
    return (
      <BeredskapsperiodeVurderingsdetaljer
        beredskapsperiode={valgtPeriode}
        onEditClick={onEditClick}
        beskrivelser={beskrivelser}
      />
    );
  }
  return (
    <VurderingAvBeredskapsperioderForm
      key={valgtPeriode.id}
      beredskapsperiode={valgtPeriode}
      onCancelClick={onCancelClick}
      beskrivelser={beskrivelser}
    />
  );
};

export default BeredskapsperiodeoversiktController;
