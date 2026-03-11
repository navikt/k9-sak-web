import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import AktivitetspengerBeregning from './AktivitetspengerBeregning.js';
import AktivitetspengerBeregningBackendClient from './AktivitetspengerBeregningBackendClient.js';

interface Props {
  behandling: Pick<BehandlingDto, 'uuid'>;
}

const api = new AktivitetspengerBeregningBackendClient();
const AktivitetspengerBeregningIndex = ({ behandling }: Props) => {
  return <AktivitetspengerBeregning behandling={behandling} api={api} />;
};

export default AktivitetspengerBeregningIndex;
