import { Aksjonspunkt, Vilkar, Dokument, Innsyn } from '@k9-sak-web/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  innsyn: Innsyn;
  innsynDokumenter: Dokument[];
}

export default FetchedData;
