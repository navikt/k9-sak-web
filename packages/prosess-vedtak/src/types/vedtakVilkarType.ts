import { Kodeverk } from '@k9-sak-web/types';

interface VedtakVilkarType {
  lovReferanse?: string;
  vilkarType: Kodeverk;
  perioder: {
    vilkarStatus: Kodeverk;
  }[];
}

export default VedtakVilkarType;
