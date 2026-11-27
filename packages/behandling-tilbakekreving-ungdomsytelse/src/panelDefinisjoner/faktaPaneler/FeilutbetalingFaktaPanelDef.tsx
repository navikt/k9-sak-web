import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import FeilutbetalingFaktaIndex from '@k9-sak-web/gui/fakta/feilutbetaling/FeilutbetalingFaktaIndex.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Fagsak, FeilutbetalingFakta } from '@k9-sak-web/types';

class FeilutbetalingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.FEILUTBETALING;

  getTekstKode = () => 'TilbakekrevingFakta.FaktaFeilutbetaling';

  getAksjonspunktKoder = () => [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING];

  getKomponent = props => (
    <FeilutbetalingFaktaIndex
      behandlingUuid={props.behandling.uuid}
      behandlingVersjon={props.behandling.versjon}
      fagsakYtelseType={props.fagsakYtelseTypeKode}
      readOnly={props.readOnly}
      hasOpenAksjonspunkter={props.harApneAksjonspunkter}
      alleMerknaderFraBeslutter={props.alleMerknaderFraBeslutter}
      submitCallback={props.submitCallback}
    />
  );

  getOverstyrVisningAvKomponent = ({ feilutbetalingFakta }: { feilutbetalingFakta: FeilutbetalingFakta }) =>
    !!feilutbetalingFakta;

  getData = ({ fagsak }: { fagsak: Fagsak }) => ({
    fagsakYtelseTypeKode: fagsak.sakstype,
  });
}

export default FeilutbetalingFaktaPanelDef;
