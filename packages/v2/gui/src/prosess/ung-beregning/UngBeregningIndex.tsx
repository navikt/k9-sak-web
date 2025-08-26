import type {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  ung_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
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
