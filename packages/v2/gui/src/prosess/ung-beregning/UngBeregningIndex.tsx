import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { UngBehandlingDto as BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/UngBehandlingDto.js';
import UngBeregning from './UngBeregning';
import UngBeregningBackendClient from './UngBeregningBackendClient';
import type { Barn } from './types/Barn';

interface Props {
  behandling: BehandlingDto;
  barn: Barn[];
  submitCallback: (data: unknown) => Promise<any>;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
}

const UngBeregningIndex = ({ barn, behandling, submitCallback, aksjonspunkter, isReadOnly }: Props) => {
  const ungBeregningBackendClient = new UngBeregningBackendClient();
  return (
    <UngBeregning
      behandling={behandling}
      api={ungBeregningBackendClient}
      barn={barn}
      submitCallback={submitCallback}
      aksjonspunkter={aksjonspunkter}
      isReadOnly={isReadOnly}
    />
  );
};

export default UngBeregningIndex;
