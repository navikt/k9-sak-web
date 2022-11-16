import { Historikkinnslag } from '@k9-sak-web/types';
import { Location } from 'history';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

interface HistorikkMal {
  historikkinnslag: Historikkinnslag;
  behandlingLocation: Location;
  getKodeverknavn: (kode: string, kodeverk: KodeverkType) => string;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  saksnummer: string;
  erTilbakekreving: boolean;
}

export default HistorikkMal;
