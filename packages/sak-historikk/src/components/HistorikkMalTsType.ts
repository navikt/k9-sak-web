import { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/kodeverk/types.js';
import { Historikkinnslag } from '@k9-sak-web/types';
import SkjermlenkeTyper from '@k9-sak-web/types/src/totrinnskontroll/SkjermlenkeType';
import { Location } from 'history';

interface HistorikkMal {
  historikkinnslag: Historikkinnslag;
  behandlingLocation: Location;
  kodeverkNavnFraKodeFn: KodeverkNavnFraKodeFnType;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: SkjermlenkeTyper) => Location;
  saksnummer: string;
  erTilbakekreving: boolean;
}

export default HistorikkMal;
