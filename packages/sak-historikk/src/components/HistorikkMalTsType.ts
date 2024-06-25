import { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/types/index.js';
import { Historikkinnslag } from '@k9-sak-web/types';
import { Location } from 'history';

interface HistorikkMal {
  historikkinnslag: Historikkinnslag;
  behandlingLocation: Location;
  kodeverkNavnFraKodeFn: KodeverkNavnFraKodeFnType;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  saksnummer: string;
  erTilbakekreving: boolean;
}

export default HistorikkMal;
