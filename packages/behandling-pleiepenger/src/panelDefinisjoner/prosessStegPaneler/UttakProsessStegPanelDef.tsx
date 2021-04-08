import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import React from 'react';
import { Vilkar } from '@k9-sak-web/types';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import Uttak from '../../components/Uttak';

const sjekkOmVilkårHarUvurdertePerioder = (vilkar: Vilkar) =>
  vilkar.perioder.some(periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT);

const erAndreVilkårVurdert = (vilkar: Vilkar[]) => {
  const sykdomVilkar = vilkar.find(v => v.vilkarType.kode === vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR);
  const opptjeningVilkar = vilkar.find(v => v.vilkarType.kode === vilkarType.OPPTJENINGSVILKARET);
  const medlemskapVilkar = vilkar.find(v => v.vilkarType.kode === vilkarType.MEDLEMSKAPSVILKARET);

  if (sykdomVilkar) {
    const harIkkeVurdertePerioder = sjekkOmVilkårHarUvurdertePerioder(sykdomVilkar);
    if (harIkkeVurdertePerioder) {
      return false;
    }
  }

  if (opptjeningVilkar) {
    const harIkkeVurdertePerioder = sjekkOmVilkårHarUvurdertePerioder(opptjeningVilkar);
    if (harIkkeVurdertePerioder) {
      return false;
    }
  }

  if (medlemskapVilkar) {
    const harIkkeVurdertePerioder = sjekkOmVilkårHarUvurdertePerioder(medlemskapVilkar);
    if (harIkkeVurdertePerioder) {
      return false;
    }
  }

  return true;
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = ({ behandling, uttaksperioder }) => (
    <Uttak uuid={behandling.uuid} uttaksperioder={uttaksperioder?.perioder} />
  );

  getAksjonspunktKoder = () => [];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = props => {
    const { uttak, vilkar } = props;
    if (!erAndreVilkårVurdert(vilkar)) {
      return vilkarUtfallType.IKKE_VURDERT;
    }

    if (!uttak || (uttak?.perioder && Object.keys(uttak.perioder).length === 0)) {
      return vilkarUtfallType.IKKE_VURDERT;
    }

    return vilkarUtfallType.OPPFYLT;
  };

  getData = ({ uttak }) => ({
    uttaksperioder: uttak,
  });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
