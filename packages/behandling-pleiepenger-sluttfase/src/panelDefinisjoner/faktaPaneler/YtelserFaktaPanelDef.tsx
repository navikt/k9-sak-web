import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import YtelserFaktaIndex from '@k9-sak-web/gui/fakta/ytelser/YtelserFaktaIndex.js';
import { faktaPanelCodes } from '@k9-sak-web/gui/utils/skjermlenke/faktaPanelCodes.js';

class YtelserFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.YTELSER;

  getTekstKode = () => 'YtelserFaktaIndex.Ytelser';

  getKomponent = props => <YtelserFaktaIndex behandlingUuid={props.behandling.uuid} />;

  skalVisePanel = (_apCodes, { personopplysninger }, featureToggles) =>
    Boolean(featureToggles?.BRUK_V2_YTELSER && personopplysninger);
}

export default YtelserFaktaPanelDef;
