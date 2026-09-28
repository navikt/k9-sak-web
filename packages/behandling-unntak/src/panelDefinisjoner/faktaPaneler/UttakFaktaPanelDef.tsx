import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import FaktaRammevedtakIndex from '@k9-sak-web/fakta-barn-og-overfoeringsdager';
import { FaktaPanelDef, VersjonsvelgerV1V2 } from '@k9-sak-web/behandling-felles';
import DelingAvDagerFaktaIndex from '@k9-sak-web/gui/fakta/deling-av-dager/DelingAvDagerFaktaIndex.js';

class UttakFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTTAK;

  getTekstKode = () => 'FaktaRammevedtak.Title';

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_DELING_AV_DAGER) {
      return (
        <VersjonsvelgerV1V2
          v1={<FaktaRammevedtakIndex {...props} />}
          v2={<DelingAvDagerFaktaIndex behandlingUuid={props.behandling.uuid} />}
        />
      );
    }
    return <FaktaRammevedtakIndex {...props} />;
  };

  getOverstyrVisningAvKomponent = ({ forbrukteDager }) => !!forbrukteDager;

  getData = ({ forbrukteDager }) => ({ rammevedtak: forbrukteDager?.rammevedtak || [] });
}

export default UttakFaktaPanelDef;
