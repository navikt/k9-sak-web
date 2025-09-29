import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import VurderOverlappendeSak from './VurderOverlappendeSak';

interface Props {
  behandling: BehandlingDto;
  aksjonspunkt: AksjonspunktDto;
  readOnly: boolean;
  oppdaterBehandling: () => void;
}

const VurderOverlappendeSakIndex = ({ behandling, aksjonspunkt, readOnly, oppdaterBehandling }: Props) => {
  const behandlingUttakBakcendClient = new BehandlingUttakBackendClient();

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
