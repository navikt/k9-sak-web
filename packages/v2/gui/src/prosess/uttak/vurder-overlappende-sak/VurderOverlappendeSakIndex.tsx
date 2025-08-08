import { useContext } from 'react';
import type { AksjonspunktDto, BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';
import { K9SakClientContext } from '../../../app/K9SakClientContext';
import BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import VurderOverlappendeSak from './VurderOverlappendeSak';

interface Props {
  behandling: BehandlingDto;
  aksjonspunkt: AksjonspunktDto;
  readOnly: boolean;
  oppdaterBehandling: () => void;
}

const VurderOverlappendeSakIndex = ({ behandling, aksjonspunkt, readOnly, oppdaterBehandling }: Props) => {
  const k9SakClient = useContext(K9SakClientContext);
  const behandlingUttakBakcendClient = new BehandlingUttakBackendClient(k9SakClient);

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
