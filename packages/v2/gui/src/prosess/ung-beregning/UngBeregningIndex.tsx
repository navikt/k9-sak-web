import type {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  ung_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated';
import UngBeregning from './UngBeregning';
import UngBeregningBackendClient from './UngBeregningBackendClient';
import type { Barn } from './types/Barn';
import { getUngSakClient } from '@k9-sak-web/backend/ungsak/client';

interface Props {
  behandling: BehandlingDto;
  barn: Barn[];
  submitCallback: (data: unknown) => Promise<any>;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
}

const UngBeregningIndex = ({ barn, behandling, submitCallback, aksjonspunkter, isReadOnly }: Props) => {
  const ungSakClient = getUngSakClient();
  const ungBeregningBackendClient = new UngBeregningBackendClient(ungSakClient);
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
