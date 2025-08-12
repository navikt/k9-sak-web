import { useContext } from 'react';
import type {
  sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { K9SakClientContext } from '../../../app/K9SakClientContext';
import BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import VurderOverlappendeSak from './VurderOverlappendeSak';

interface Props {
  behandling: BehandlingDto;
  aksjonspunkt: AksjonspunktDto;
  readOnly: boolean;
}

const VurderOverlappendeSakIndex = ({ behandling, aksjonspunkt, readOnly }: Props) => {
  const k9SakClient = useContext(K9SakClientContext);
  const behandlingUttakBakcendClient = new BehandlingUttakBackendClient(k9SakClient);

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
    <VurderOverlappendeSak
      behandling={behandling}
      aksjonspunkt={aksjonspunkt}
      readOnly={readOnly}
      api={behandlingUttakBakcendClient}
      oppdaterBehandling={oppdaterBehandling}
    />
  );
};

export default VurderOverlappendeSakIndex;
