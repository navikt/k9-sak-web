import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/generated';
import { useContext } from 'react';
import { UngSakClientContext } from '../../app/UngSakClientContext';
import UngBeregning from './UngBeregning';
import UngBeregningBackendClient from './UngBeregningBackendClient';

interface Props {
  behandling: BehandlingDto;
}

const UngBeregningIndex = ({ behandling }: Props) => {
  const ungSakClient = useContext(UngSakClientContext);
  const ungBeregningBackendClient = new UngBeregningBackendClient(ungSakClient);
  return <UngBeregning behandling={behandling} api={ungBeregningBackendClient} />;
};

export default UngBeregningIndex;
