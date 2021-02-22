import React from 'react';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import FaktaBarnIndex from '@k9-sak-web/fakta-barn-oms';

class BarnFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BARN;

  getTekstKode = () => 'FaktaBarn.Title';

  getKomponent = props => <FaktaBarnIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ rammevedtak }) => !!rammevedtak;

  getData = ({ soknad }) => ({ barn: soknad?.barna || [] });
}

export default BarnFaktaPanelDef;
