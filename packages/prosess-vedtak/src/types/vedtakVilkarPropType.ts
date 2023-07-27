import { Kodeverk } from '@k9-sak-web/types';

interface VedtakVilkarPropType {
  lovReferanse?: string;
  vilkarType: Kodeverk;
  perioder: {
    vilkarStatus: Kodeverk;
  }[];
}

export default VedtakVilkarPropType;
