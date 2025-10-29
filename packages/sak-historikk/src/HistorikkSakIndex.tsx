import { Location } from 'history';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Historikkinnslag, KodeverkMedNavn } from '@k9-sak-web/types';

import messages from '../i18n/nb_NO.json';
import History from './components/History';

interface OwnProps {
  historikkinnslag: Historikkinnslag;
  saksnummer?: string;
  getBehandlingLocation: (behandlingId: number) => Location;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  erTilbakekreving: boolean;
}

const HistorikkSakIndex = ({
  historikkinnslag,
  saksnummer,
  getBehandlingLocation,
  alleKodeverk,
  createLocationForSkjermlenke,
  erTilbakekreving,
}: OwnProps) => (
      <History
      historikkinnslag={historikkinnslag}
      saksnummer={saksnummer}
      getBehandlingLocation={getBehandlingLocation}
      getKodeverknavn={getKodeverknavnFn(alleKodeverk, kodeverkTyper)}
      createLocationForSkjermlenke={createLocationForSkjermlenke}
      erTilbakekreving={erTilbakekreving}
    />);

export default HistorikkSakIndex;
