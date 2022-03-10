import { Historikkinnslag } from '@k9-sak-web/types';
import { Location } from 'history';

interface HistorikkMal {
  historikkinnslag: Historikkinnslag;
  behandlingLocation: Location;
  getKodeverknavn: (kodeverk: string) => string;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  saksnummer: string;
  erTilbakekreving: boolean;
}

export default HistorikkMal;
