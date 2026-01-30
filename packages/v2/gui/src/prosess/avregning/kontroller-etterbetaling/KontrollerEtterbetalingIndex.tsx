import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import BehandlingAvregningBackendClient from '../AvregningBackendClient';
import KontrollerEtterbetaling from './KontrollerEtterbetaling';

interface Props {
  behandling: BehandlingDto;
  aksjonspunkt: AksjonspunktDto;
  readOnly: boolean;
}

const KontrollerEtterbetalingIndex = ({ aksjonspunkt, behandling, readOnly }: Props) => {
  const behandlingAvregningBackendClient = new BehandlingAvregningBackendClient();

  /*
   * Midlertidig fiks for å oppdatere behandling etter å ha fullført aksjonspunkt. Ifm med
   * kodeverk-endringene kommer en context for behandlingsid og -versjon, denne kan nok
   * tilpasses til å kunne trigge oppdatering av behandling "on-demand"
   */
  const oppdaterBehandling = () => {
    // FIXME temp fiks for å håndtere oppdatering av behandling
    window.location.reload();
  };

  return (
    <KontrollerEtterbetaling
      behandling={behandling}
      aksjonspunkt={aksjonspunkt}
      readOnly={readOnly}
      api={behandlingAvregningBackendClient}
      oppdaterBehandling={oppdaterBehandling}
    />
  );
};

export default KontrollerEtterbetalingIndex;
