import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/generated';
import { useContext } from 'react';
import { UngSakClientContext } from '../../app/UngSakClientContext';
import UngBeregning from './UngBeregning';
import UngBeregningBackendClient from './UngBeregningBackendClient';
import type { Barn } from './types/Barn';

interface Props {
  behandling: BehandlingDto;
  barn: Barn[];
}

const UngBeregningIndex = ({ barn, behandling }: Props) => {
  const ungSakClient = useContext(UngSakClientContext);
  const ungBeregningBackendClient = new UngBeregningBackendClient(ungSakClient);
  return <UngBeregning behandling={behandling} api={ungBeregningBackendClient} barn={barn} />;
};

export default UngBeregningIndex;
