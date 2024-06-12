import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Fagsak } from '@k9-sak-web/types';

import UtvidetRettBarnFakta from '../../components/UtvidetRettBarnFakta/UtvidetRettBarnFakta';

class BarnFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BARN;

  getTekstKode = () => 'FaktaBarn.Title';

  getKomponent = props => <UtvidetRettBarnFakta {...props} />;

  getOverstyrVisningAvKomponent = ({ rammevedtak }) => !!rammevedtak;

  getData = ({
    personopplysninger,
    fagsak,
    rammevedtak,
  }: {
    personopplysninger: any;
    fagsak: Fagsak;
    rammevedtak: { rammevedtak: any[] };
  }) => ({
    personopplysninger,
    rammevedtak: rammevedtak?.rammevedtak || [],
    fagsaksType: fagsak.sakstype,
  });
}
export default BarnFaktaPanelDef;
