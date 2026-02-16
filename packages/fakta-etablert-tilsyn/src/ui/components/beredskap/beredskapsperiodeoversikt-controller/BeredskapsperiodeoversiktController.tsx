import * as React from 'react';
import type Beskrivelse from '../../../../types/Beskrivelse';
import type Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Vurderingsresultat from '../../../../types/Vurderingsresultat';
import BeredskapsperiodeVurderingsdetaljer from '../beredskapsperiode-vurderingsdetaljer/BeredskapsperiodeVurderingsdetaljer';
import VurderingAvBeredskapsperioderForm from '../vurdering-av-beredskapsperioder-form/VurderingAvBeredskapsperioderForm';

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
