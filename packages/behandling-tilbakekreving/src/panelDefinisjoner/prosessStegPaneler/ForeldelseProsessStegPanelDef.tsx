import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { konverterKodeverkTilKode } from '@fpsak-frontend/utils';
import { getAlleMerknaderFraBeslutter, ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import ForeldelseProsessIndexWrapper from '../../components/ForeldelseProsessIndexWrapper';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, true);
    return (
      <ForeldelseProsessIndexWrapper
        {...deepCopyProps}
        kodeverkSamling={props.alleKodeverk}
        submitCallback={props.submitCallback}
        beregnBelop={props.beregnBelop}
      />
    );
  };

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ perioderForeldelse }) =>
    perioderForeldelse ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT;

  getAksjonspunktKoder = () => [aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE];

  getData = ({ behandling, aksjonspunkterForSteg, perioderForeldelse, fagsakPerson, beregnBelop }) => ({
    perioderForeldelse,
    beregnBelop,
    navBrukerKjonn: fagsakPerson.erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN, // TODO: Deprecate
    alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForSteg),
    fagsakPerson,
  });
}

class ForeldelseProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORELDELSE;

  getTekstKode = () => 'Behandlingspunkt.Foreldelse';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default ForeldelseProsessStegPanelDef;
