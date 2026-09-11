import DirekteOvergangFaktaIndex from '@fpsak-frontend/fakta-direkte-overgang';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { DirekteOvergangFaktaIndex as DirekteOvergangFaktaIndexV2 } from '@k9-sak-web/gui/fakta/direkte-overgang/DirekteOvergangFaktaIndex.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class DirekteOvergangFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INFOTRYGDMIGRERING;

  getTekstKode = () => 'InfotrygdmigreringPanel.Infotrygdmigrering';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD,
    aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART,
  ];

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_DIREKTE_OVERGANG) {
      const aksjonspunkter = JSON.parse(JSON.stringify(props.aksjonspunkter));
      konverterKodeverkTilKode(aksjonspunkter, false);

      return (
        <DirekteOvergangFaktaIndexV2
          submitCallback={props.submitCallback}
          readOnly={props.readOnly}
          submittable={props.submittable}
          aksjonspunkter={aksjonspunkter}
        />
      );
    }

    const { submitCallback, readOnly, submittable, aksjonspunkter } = props;
    return (
      <DirekteOvergangFaktaIndex
        submitCallback={submitCallback}
        readOnly={readOnly}
        submittable={submittable}
        aksjonspunkter={aksjonspunkter}
      />
    );
  };
}

export default DirekteOvergangFaktaPanelDef;
