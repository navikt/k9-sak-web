import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import FaktaRammevedtakIndex from '@k9-sak-web/fakta-barn-og-overfoeringsdager';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import React from 'react';

class UttakFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTTAK;

  getTekstKode = () => 'FaktaRammevedtak.Title';

  getKomponent = props => <FaktaRammevedtakIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ forbrukteDager }) => !!forbrukteDager;

  getData = ({ forbrukteDager }) => ({ rammevedtak: forbrukteDager?.rammevedtak || [] });
}

export default UttakFaktaPanelDef;
