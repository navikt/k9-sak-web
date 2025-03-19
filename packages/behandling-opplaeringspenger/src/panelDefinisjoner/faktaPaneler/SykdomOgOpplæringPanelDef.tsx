import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling } from '@k9-sak-web/types';
import SykdomOgOpplæringIndex from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/SykdomOgOpplæringIndex.js';

class SykdomOgOpplæringPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.SYKDOM_OG_OPPLAERING;

  getTekstKode = () => 'FaktaSykdomOgOpplaering.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR, aksjonspunktCodes.VURDER_INSTITUSJON];

  getEndepunkter = () => [];

  getKomponent = ({ readOnly, submitCallback, behandling }) => {
    return (
      <SykdomOgOpplæringIndex submitCallback={submitCallback} readOnly={readOnly} behandlingUuid={behandling.uuid} />
    );
  };

  getData = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    return {
      fagsakYtelseType: fagsak.sakstype,
      behandlingType: behandling.type.kode,
    };
  };

  getOverstyrVisningAvKomponent = ({ behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return søknadsfristErIkkeUnderVurdering;
  };
}

export default SykdomOgOpplæringPanelDef;
