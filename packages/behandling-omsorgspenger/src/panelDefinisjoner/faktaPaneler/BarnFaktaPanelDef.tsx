import React from 'react';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import FaktaBarnIndex from '@k9-sak-web/fakta-barn-oms';

class BarnFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BARN;

  getTekstKode = () => 'FaktaBarn.Title';

  getKomponent = props => <FaktaBarnIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ forbrukteDager }) => !!forbrukteDager;

  getData = ({ forbrukteDager }) => ({
    barn: forbrukteDager?.barna || [],
    rammevedtak: forbrukteDager?.rammevedtak || [],
  });
}

export default BarnFaktaPanelDef;
