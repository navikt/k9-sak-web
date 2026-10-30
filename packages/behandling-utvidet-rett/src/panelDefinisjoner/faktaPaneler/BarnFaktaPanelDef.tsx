import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { BarnOmsFakta } from '@k9-sak-web/gui/fakta/barn-oms/BarnOmsFakta.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Fagsak } from '@k9-sak-web/types';
import UtvidetRettBarnFakta from '../../components/UtvidetRettBarnFakta/UtvidetRettBarnFakta';
import { barnForUtvidetRett } from './barnForUtvidetRett';

class BarnFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BARN;

  getTekstKode = () => 'FaktaBarn.Title';

  getKomponent = ({ personopplysninger, fagsaksType, rammevedtak, featureToggles }) => {
    if (featureToggles?.BRUK_V2_BARN_OMS) {
      return (
        <BarnOmsFakta
          barn={barnForUtvidetRett(personopplysninger, fagsaksType)}
          rammevedtak={rammevedtak}
          fagsakYtelseType={fagsaksType}
        />
      );
    }
    return (
      <UtvidetRettBarnFakta
        personopplysninger={personopplysninger}
        fagsaksType={fagsaksType}
        rammevedtak={rammevedtak}
      />
    );
  };

  getOverstyrVisningAvKomponent = ({ rammevedtak }) => !!rammevedtak;

  getData = ({ personopplysninger, fagsak, rammevedtak }: { personopplysninger; fagsak: Fagsak; rammevedtak }) => ({
    personopplysninger,
    rammevedtak: rammevedtak?.rammevedtak || [],
    fagsaksType: fagsak.sakstype,
  });
}
export default BarnFaktaPanelDef;
