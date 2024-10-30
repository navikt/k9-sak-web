import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';
import { useContext } from 'react';
import { K9SakClientContext } from '../../app/K9SakClientContext';
import UngBeregning from './UngBeregning';
import UngBeregningBackendClient from './UngBeregningBackendClient';

interface Props {
  behandling: BehandlingDto;
}

const UngBeregningIndex = ({ behandling }: Props) => {
  const k9SakClient = useContext(K9SakClientContext);
  const ungBeregningBackendClient = new UngBeregningBackendClient(k9SakClient);
  return <UngBeregning behandling={behandling} api={ungBeregningBackendClient} />;
};

export default UngBeregningIndex;
